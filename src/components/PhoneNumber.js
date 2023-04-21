import React from "react";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import "./css/phoneNumber.css";

// How to use
// <PhoneNumber value={phoneNumber} setValue={handleChangephoneNumber} inputProps={{name:"input"}} /> 

const PhoneNumber = (props) => {
  const { value, setValue, inputProps } = props;
  return (
    <div className="phone-number-input">
      <ReactPhoneInput
        inputProps={inputProps}
        value={value.phone}
        onChange={(value, country) => setValue({phone: "+"+value, valid: value.length === country.format.split(".").length - 1})}
        country="in"
        preferredCountries={["in"]}
        placeholder="Enter Your Phone number"
        enableSearch={true}
      />
    </div>
  );
};

export default PhoneNumber;
