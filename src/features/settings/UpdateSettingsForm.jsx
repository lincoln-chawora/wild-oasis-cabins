import Form from '../../ui/Form.jsx';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import {useCustomQuery} from "../../hooks/useCustomQuery.js";
import {getSettings} from "../../services/apiSettings.js";
import Spinner from "../../ui/Spinner.jsx";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {updateSetting as updateSettingApi} from "../../services/apiSettings.js";

function UpdateSettingsForm() {
    const {
        isLoading,
        result: {
            breakfastPrice, maxBookingLength, minBookingLength, maxGuestsPerBooking
        } = {},
    } = useCustomQuery('settings', getSettings);

    const {mutate: updateSetting, isLoading: isUpdating} = useCustomQueryClient('settings', updateSettingApi, 'Setting successfully updated.')

    if (isLoading) return  <Spinner />

    function handleUpdate(e, field) {
        const value = e.target.value;

        if (!value) return;

        updateSetting({[field]: value});
    }

  return (
    <Form>
      <FormRow label='Minimum nights/booking'>
        <Input type='number' id='min-nights' disabled={isUpdating} onBlur={(e) => handleUpdate(e, 'minBookingLength')} defaultValue={minBookingLength} />
      </FormRow>
      <FormRow label='Maximum nights/booking'>
        <Input type='number' id='max-nights' disabled={isUpdating} onBlur={(e) => handleUpdate(e, 'maxBookingLength')} defaultValue={maxBookingLength} />
      </FormRow>
      <FormRow label='Maximum guests/booking'>
        <Input type='number' id='max-guests' disabled={isUpdating} onBlur={(e) => handleUpdate(e, 'maxGuestsPerBooking')} defaultValue={maxGuestsPerBooking} />
      </FormRow>
      <FormRow label='Breakfast price'>
        <Input type='number' id='breakfast-price' disabled={isUpdating} onBlur={(e) => handleUpdate(e, 'breakfastPrice')} defaultValue={breakfastPrice} />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
