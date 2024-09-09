import {useForm, useWatch} from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form.jsx";
import Button from "../../ui/Button.jsx";
import Textarea from "../../ui/Textarea.jsx";
import FormRow from "../../ui/FormRow.jsx";
import {StyledSelect} from "../../ui/Select.jsx";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {createEditBooking} from "../../services/apiBookings.js";
import {
    formatCurrency,
    objsAreTheSame, subtractDates
} from "../../utils/helpers.js";
import {useEffect} from "react";
import {StyledCheckbox} from "../../ui/Checkbox.jsx";
import Heading from "../../ui/Heading.jsx";
import {createEditGuest, deleteGuest as deleteGuestApi} from "../../services/apiGuests.js";
import {useCustomQuery} from "../../hooks/useCustomQuery.js";
import {getSettings} from "../../services/apiSettings.js";
import {addDays} from "date-fns";

function CreateEditBookingForm({bookingToEdit = {}, cabinToBook = {}, onCloseModal}) {
    let { id: editId, cabins: cabinValues, guests: {id: guestId, ...guestValues} = {}, ...editValues } = bookingToEdit;

    const allBookingData = {...editValues, ...guestValues};

    const isEditSession = Boolean(editId);

    const {register, handleSubmit, reset, setValue, control, getValues, formState} = useForm({
        defaultValues: isEditSession ? allBookingData : cabinToBook ? cabinToBook : {}
    });

    const {errors} = formState;

    const {result: { breakfastPrice, minBookingLength} = {}, isLoading: isLoadingSettings } = useCustomQuery('settings', getSettings);
    const {mutate: editBooking, isLoading: isEditingBooking} = useCustomQueryClient('booking', ({id, newBookingData}) => createEditBooking(id, newBookingData), `${getValues()?.fullName}'s booking has been successfully edited.`)
    const {mutate: editGuest, isLoading: isEditingGuest} = useCustomQueryClient('booking', ({id, newGuestData}) => createEditGuest(id, newGuestData))
    const {mutate: createBooking, isLoading: isCreatingBooking} = useCustomQueryClient('bookings', ({id, newBookingObj}) => createEditBooking(id, newBookingObj), 'New booking successfully created.')
    const {mutate: createGuest, isLoading: isCreatingGuest} = useCustomQueryClient('bookings', ({id, newGuestData}) => createEditGuest(id, newGuestData))
    const {mutate: deleteGuest, isLoading: isDeletingGuest} = useCustomQueryClient('guests', deleteGuestApi)

    const isWorking = isCreatingBooking || isEditingBooking || isEditingGuest || isCreatingGuest || isLoadingSettings || isDeletingGuest;

    // Watch the values of the cabinPrice and extrasPrice fields
    const numNights = useWatch({ name: 'booking.numNights', control });
    const extrasPrice = useWatch({ name: 'booking.extrasPrice', control });
    const numGuests = useWatch({ name: 'booking.numGuests', control });
    const hasBreakfast = useWatch({ name: 'booking.hasBreakfast', control });
    const startDate = useWatch({ name: 'booking.startDate', control });
    const endDate = useWatch({ name: 'booking.endDate', control });

    if (cabinToBook) {
        cabinValues = cabinToBook
    }

    useEffect(() => {
        const totalDiscount = cabinValues?.discount * numNights;
        const priceForNight = cabinValues?.regularPrice * (numNights || 0);
        const totalPrice = (priceForNight || 0) - (totalDiscount || 0) + Number((extrasPrice || 0));
        const extras = hasBreakfast ? (numNights || 0) * (breakfastPrice || 0) * (numGuests || 0) : 0;

        // Update the values below whenever the watched values change.
        setValue('booking.totalPrice', totalPrice);
        setValue('booking.extrasPrice', extras);
        setValue('booking.cabinPrice', priceForNight);
        setValue('booking.numNights', Math.abs(subtractDates(startDate || new Date().toISOString(), endDate || new Date().toISOString())));
    }, [startDate, cabinValues, extrasPrice, setValue, numNights, numGuests, breakfastPrice, hasBreakfast, endDate]);

    function onSubmit(data) {
        const newBookingData = data?.booking;
        const newGuestData = data?.guest;

        if(isEditSession) {
            editBooking({id: editId, newBookingData}, {
                onSuccess: () => {
                    if (!objsAreTheSame(guestValues, newGuestData)) {
                        editGuest({id: newBookingData.guestId, newGuestData});
                    }
                    onCloseModal?.();
                },
            });
        } else {
            createGuest({id: null, newGuestData}, {
                onSuccess: (data) => {
                    const createdUser = data;
                    const newBookingObj = {cabinId: cabinToBook.id, guestId: createdUser.id, ...newBookingData}

                    createBooking({id: null, newBookingObj}, {
                        onSuccess: () => {
                            reset();
                            onCloseModal?.();
                        },
                        onError: () => {
                            // If the booking is not able to be created, delete the guest that was created previously.
                            deleteGuest(createdUser.id);
                        }
                    });
                },
            });
        }
    }

    function onError(error) {
        console.log('Error Main', error)
        console.log('Error status', getValues())
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal? 'modal' : 'regular'}>
            <Heading as="h2">{isEditSession ? 'Editing this' : 'Create new'} booking</Heading>

            <Heading as="h3">Guest Info</Heading>
            <FormRow label="Guest Full name" error={errors?.guest?.fullName?.message}>
                <Input type="text" id="fullName" disabled={isWorking} {...register("guest.fullName", {
                    required: "This field is required",
                })} />
            </FormRow>

            <FormRow label="Email address" error={errors?.guest?.email?.message}>
                <Input type="email" id="email" disabled={isWorking} {...register("guest.email",
                    { required: "This field is required", pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Please provide a valid email address'
                        }})} />
            </FormRow>

            <FormRow label="National ID" error={errors?.guest?.nationalID?.message}>
                <Input type="text" id="nationalID" disabled={isWorking} {...register("guest.nationalID", {
                    required: "This field is required",
                })} />
            </FormRow>

            <FormRow label="Nationality" error={errors?.guest?.nationality?.message}>
                <Input type="text" id="nationality" disabled={isWorking} {...register("guest.nationality", {
                    required: "This field is required",
                })} />
            </FormRow>

            <Heading as="h3">Booking Info</Heading>
            <FormRow label="Start date" error={errors?.booking?.startDate?.message}>
                <Input type="datetime-local" id="startDate" min={new Date().toISOString().slice(0, -8)} disabled={isWorking} {...register("booking.startDate", {
                    required: "This field is required"
                })} />
            </FormRow>

            <FormRow label="End date" error={errors?.endDate?.message}>
                <Input type="datetime-local" id="endDate" min={addDays(new Date(), minBookingLength || 4).toISOString().slice(0, -8)} disabled={isWorking} {...register("booking.endDate", {
                    required: "This field is required"
                })} />
            </FormRow>

            <FormRow label="Number of nights" error={errors?.booking?.numNights?.message}>
              <Input type="number" id="numNights" disabled {...register("booking.numNights", {
                  required: "This field is required",
                  min: {
                      value: 1,
                      message: 'Number of nights should be at least one.'
                  }
              })} />
            </FormRow>

            <FormRow label="Number of guests" error={errors?.booking?.numGuests?.message}>
              <Input type="number" id="numGuests" disabled={isWorking} {...register("booking.numGuests", {
                  required: "This field is required",
                  min: {
                      value: 1,
                      message: 'Number of guests should be at least one.'
                  }
              })} />
            </FormRow>

            <FormRow label="Include breakfast" error={errors?.booking?.hasBreakfast?.message}>
                <StyledCheckbox>
                    <Input type="checkbox" id="hasBreakfast" disabled={isWorking} {...register("booking.hasBreakfast")} />
                </StyledCheckbox>
            </FormRow>

            <FormRow label="Cabin price" error={errors?.booking?.cabinPrice?.message}>
                <Input type="number" id="cabinPrice" disabled {...register("booking.cabinPrice", {
                    required: "This field is required",
                })} />
            </FormRow>

            <FormRow label="Extras price" error={errors?.extrasPrice?.message}>
              <Input type="number" id="extrasPrice" disabled={isWorking} {...register("booking.extrasPrice", {
                  required: "This field is required",
              })} />
            </FormRow>

            <FormRow label="Total price" error={errors?.booking?.totalPrice?.message}>
                <>
                  <Input type="number" id="totalPrice" disabled {...register("booking.totalPrice", {
                      required: "This field is required",
                  })} />

                    <p>The cabin discount of {formatCurrency(cabinValues?.discount)} is be applied to this total.</p>
                </>
            </FormRow>

            <FormRow label="Booking status" error={errors?.booking?.status?.message}>
                <StyledSelect {...register("booking.status", {
                    required: "This field is required",
                })}>
                    {[
                        {value: 'unconfirmed', label: 'Unconfirmed'},
                        {value: 'checked-in', label: 'Checked in'},
                        {value: 'checked-out', label: 'Checked out'},
                    ].map(option => (
                        <option value={option.value} key={option.value}>
                            {option.label}
                        </option>
                    ))}
                </StyledSelect>
            </FormRow>

            <FormRow label="Has paid" error={errors?.isPaid?.message}>
                <StyledCheckbox>
                    <Input type="checkbox" id="isPaid" disabled={isWorking} {...register("booking.isPaid")} />
                </StyledCheckbox>
            </FormRow>

            <FormRow label="Booking details" error={errors?.observations?.message}>
              <Textarea type="text" id="observations" disabled={isWorking} defaultValue="" {...register("booking.observations")}/>
            </FormRow>

            <FormRow>
                <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>Cancel</Button>
                <Button disabled={isWorking}>
                    {isWorking ? 'Processing...' : isEditSession ? 'Edit booking' : 'Create new booking'}
                </Button>
            </FormRow>
        </Form>
    );
}

export default CreateEditBookingForm;
