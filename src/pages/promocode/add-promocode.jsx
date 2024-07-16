import React, { useState } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import Textinput from "../../components/ui/Textinput";
import Button from "../../components/ui/Button";
import Switch from "../../components/ui/Switch";
import { BASE_URL } from "../../api";
import { format, parseISO } from "date-fns";

const promocodeType = ["FIXED", "PERCENTAGE"];

const AddPromocode = () => {
  const [formData, setFormData] = useState({
    promoCode: "",
    discount: "",
    promoCodeType: promocodeType[0],
    publicShown: false,
    startDate: "",
    expireDate: ""
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === "datetime-local") {
      const formattedDate = value.replace("T", " ");
      setFormData({
        ...formData,
        [id]: formattedDate
      });
    } else if (id === "publicShown") {
      setFormData({
        ...formData,
        publicShown: checked
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const formattedData = {
        ...formData,
        startDate: format(parseISO(formData.startDate), "dd-MM-yyyy HH:mm:ss"),
        expireDate: format(parseISO(formData.expireDate), "dd-MM-yyyy HH:mm:ss")
      };
      const response = await axios.post(`${BASE_URL}/promo-code/add`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error adding promocode:", error);
    }
  };

  return (
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">Add Promocode</h4>
      </div>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            label="Promo Code"
            id="promoCode"
            type="text"
            value={formData.promoCode}
            onChange={handleChange}
          />
          <Textinput
            label="Discount"
            id="discount"
            type="text"
            value={formData.discount}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="promoCodeType" className="form-label">Select Promocode Type</label>
            <select
              className="form-control py-2 form-select h-50"
              id="promoCodeType"
              value={formData.promoCodeType}
              onChange={handleChange}
            >
              {promocodeType.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Switch
            label="Public Shown"
            id="publicShown"
            checked={formData.publicShown}
            onChange={handleChange}
          />
          <Textinput
            label="Start Date"
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange}
          />
          <Textinput
            label="Expiry Date"
            id="expireDate"
            type="datetime-local"
            value={formData.expireDate}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-4 text-end">
          <Button text="Submit" className="btn-dark" type="submit" />
        </div>
      </form>
    </Card>
  );
};

export default AddPromocode;
