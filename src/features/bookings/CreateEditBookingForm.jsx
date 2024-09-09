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
    getDifference,
    getDifferenceReversed,
    objsAreTheSame
} from "../../utils/helpers.js";
import {useEffect} from "react";
import {StyledCheckbox} from "../../ui/Checkbox.jsx";
import Heading from "../../ui/Heading.jsx";
import {createEditGuest} from "../../services/apiGuests.js";

function CreateEditBookingForm({bookingToEdit = {}, onCloseModal}) {
    const { id: editId, cabins: cabinValues, guests: {id: guestId, ...guestValues} = {}, ...editValues } = bookingToEdit;

    const allBookingData = {...editValues, ...guestValues};

    const isEditSession = Boolean(editId);

    const {register, handleSubmit, reset, setValue, control, getValues, formState} = useForm({
        defaultValues: isEditSession ? allBookingData : {}
    });

    const {errors} = formState;

    const {mutate: editBooking, isLoading: isEditingBooking} = useCustomQueryClient('booking', ({id, newBookingData}) => createEditBooking(id, newBookingData), `${getValues()?.fullName}'s booking has been successfully edited.`)
    const {mutate: editGuest, isLoading: isEditingGuest} = useCustomQueryClient('booking', ({id, newUserData}) => createEditGuest(id, newUserData))
    const {mutate: createBooking, isLoading: isCreatingBooking} = useCustomQueryClient('bookings', createEditBooking, 'New booking successfully created.')
    const {mutate: createGuest, isLoading: isCreatingGuest} = useCustomQueryClient('bookings', createEditGuest)

    const isWorking = isCreatingBooking || isEditingBooking || isEditingGuest || isCreatingGuest;

    // Watch the values of the cabinPrice and extrasPrice fields
    const numNights = useWatch({ name: 'numNights', control });
    const extrasPrice = useWatch({ name: 'extrasPrice', control });

    useEffect(() => {
        const totalDiscount = cabinValues?.discount * numNights;
        const priceForNight = cabinValues?.regularPrice * numNights;
        const totalPrice = priceForNight - totalDiscount + Number(extrasPrice);

        // Update totalPrice and cabinPrice whenever extrasPrice or numNight changes.
        setValue('totalPrice', totalPrice);
        setValue('cabinPrice', priceForNight);
    }, [cabinValues, extrasPrice, setValue, numNights]);

    function onSubmit(data) {
        const newBookingData = getDifference(data, guestValues);
        const newUserData = getDifferenceReversed(data, guestValues);

        if(isEditSession) {
            editBooking({id: editId, newBookingData}, {
                onSuccess: () => {
                    if (!objsAreTheSame(guestValues, newUserData)) {
                        editGuest({id: newBookingData.guestId, newUserData});
                    }
                    onCloseModal?.();
                },
            });
        } else {
            createGuest({id: null, ...data}, {
                onSuccess: (data) => {
                    console.log('New user', data)
                    // reset();
                    // onCloseModal?.();
                },
            });
            // createBooking({id: null, ...data}, {
            //     onSuccess: () => {
            //         reset();
            //         onCloseModal?.();
            //     },
            // });
        }
    }

    function onError(error) {
        console.log('Error Main', error)
        console.log('Error status', getValues().status)
    }


    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal? 'modal' : 'regular'}>
            <Heading as="h2">{isEditSession ? 'Editing this' : 'Create new'} booking</Heading>


            <Heading as="h3">Guest Info</Heading>
            <FormRow label="Guest Full name" error={errors?.fullName?.message}>
                <Input type="text" id="fullName" disabled={isWorking} {...register("fullName", {
                    required: "This field is required",
                })} />
            </FormRow>

            <FormRow label="Email address" error={errors?.email?.message}>
                <Input type="email" id="email" disabled={isWorking} {...register("email",
                    { required: "This field is required", pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Please provide a valid email address'
                        }})} />
            </FormRow>

            <FormRow label="National ID" error={errors?.nationalID?.message}>
                <Input type="text" id="nationalID" disabled={isWorking} {...register("nationalID", {
                    required: "This field is required",
                })} />
            </FormRow>

            <FormRow label="Nationality" error={errors?.nationality?.message}>
                <Input type="text" id="nationality" disabled={isWorking} {...register("nationality", {
                    required: "This field is required",
                })} />
            </FormRow>

            <Heading as="h3">Booking Info</Heading>
            <FormRow label="Start date" error={errors?.startDate?.message}>
                <Input type="datetime-local" id="startDate" disabled={isWorking} {...register("startDate", {
                    required: "This field is required"
                })} />
            </FormRow>

            <FormRow label="End date" error={errors?.endDate?.message}>
                <Input type="datetime-local" id="endDate" disabled={isWorking} {...register("endDate", {
                    required: "This field is required"
                })} />
            </FormRow>

            <FormRow label="Number of nights" error={errors?.numNights?.message}>
              <Input type="number" id="numNights" disabled={isWorking} {...register("numNights", {
                  required: "This field is required",
                  min: {
                      value: 1,
                      message: 'Number of nights should be at least one.'
                  }
              })} />
            </FormRow>

            <FormRow label="Number of guests" error={errors?.numGuests?.message}>
              <Input type="number" id="numGuests" disabled={isWorking} {...register("numGuests", {
                  required: "This field is required",
                  min: {
                      value: 1,
                      message: 'Number of guests should be at least one.'
                  }
              })} />
            </FormRow>

            <FormRow label="Cabin price" error={errors?.cabinPrice?.message}>
                <Input type="number" id="cabinPrice" disabled {...register("cabinPrice", {
                    required: "This field is required",
                })} />
            </FormRow>

            <FormRow label="Extras price" error={errors?.extrasPrice?.message}>
              <Input type="number" id="extrasPrice" disabled={isWorking} {...register("extrasPrice", {
                  required: "This field is required",
              })} />
            </FormRow>

            <FormRow label="Total price" error={errors?.totalPrice?.message}>
                <>
                  <Input type="number" id="totalPrice" disabled {...register("totalPrice", {
                      required: "This field is required",
                  })} />

                    <p>The cabin discount of {formatCurrency(cabinValues?.discount)} is be applied to this total.</p>
                </>
            </FormRow>

            <FormRow label="Booking status" error={errors?.status?.message}>
                <StyledSelect {...register("status", {
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


            <FormRow label="Has breakfast" error={errors?.hasBreakfast?.message}>
                <StyledCheckbox>
                    <Input type="checkbox" id="hasBreakfast" disabled={isWorking} {...register("hasBreakfast")} />
                </StyledCheckbox>
            </FormRow>

            <FormRow label="Has paid" error={errors?.isPaid?.message}>
                <StyledCheckbox>
                    <Input type="checkbox" id="isPaid" disabled={isWorking} {...register("isPaid")} />
                </StyledCheckbox>
            </FormRow>

            <FormRow label="Booking details" error={errors?.observations?.message}>
              <Textarea type="text" id="observations" disabled={isWorking} defaultValue="" {...register("observations")}/>
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
