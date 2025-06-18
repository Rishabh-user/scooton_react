import React, { useState } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import Textinput from "../../components/ui/Textinput";
import Button from "../../components/ui/Button";
import Switch from "../../components/ui/Switch";
import { BASE_URL } from "../../api";
import { format, parseISO } from "date-fns";
import Swicth from "../../components/ui/Switch";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPromoImg from "../../assets/images/Promo-code-img.png";
import axiosInstance from "../../api";
import { useNavigate } from "react-router-dom";


const promocodeType = ["FIXED", "PERCENTAGE"];

const AddPromocode2 = () => {
 
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    promoCode: "",
    amount: "",
    promoCodeType: promocodeType[0],
    publicShown: false,
    active: true,
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
  const handleInputChangepublicShown = (e) => {
    const { value,checked } = e.target;
    setFormData(prevDetails => ({
        ...prevDetails,
        publicShown: checked
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!formData.promoCode && !formData.amount  && !formData.startDate && !formData.expireDate) {
          toast.error("All fields are required");
          return;
    }

    if(formData.amount == ''){
      toast.error("Discount is required" );
      return
    } else if(formData.startDate == ''){
      toast.error("Start Date is required");
      return
    } else if(formData.expireDate == ''){
      toast.error("Expiry Date is required");
      return
    } 

      const token = localStorage.getItem("jwtToken");
      if(token){
      const formattedData = {
        ...formData,
        startDate: format(parseISO(formData.startDate), "dd-MM-yyyy HH:mm:ss"),
        expireDate: format(parseISO(formData.expireDate), "dd-MM-yyyy HH:mm:ss")
      };
      
      const response = await axiosInstance.post(`${BASE_URL}/promo-code/add`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
          toast.success("Promocode added successfully!");
          setTimeout(() => {
            navigate('/promocode-list')
          }, 500);
          setFormData({
            promoCode: '',
            amount: '',
            promoCodeType: promocodeType[0],  
            publicShown: false,
            startDate: '',
            expireDate: ''
          })
        })
        .catch((error) => {
          const errorMessage = error.response.data.error.match(/\[(.*?)\]/);
          console.log(error)
          if(errorMessage[1] == "Promo Code can't be empty"){
            toast.error("Promocode is required");
          }
             
        })
      
    } else((error) => {
      console.error("No token found");
    })
      

  };

  return (
    <>
      <ToastContainer />
      <Card title="Add Promocode" className="mb-0">       
        <form className="" onSubmit={handleSubmit}>
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1">
              <div className="m-auto">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Promocode Title:</label>
                    <input
                      id=""
                      type="text"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Dashboard display name only"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Promocode:</label>
                    <input
                      id=""
                      type="text"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Actual Promocode"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Applicable Discount:</label>
                    <input
                      id=""
                      type="text"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Number"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Discount Type:</label>
                    <input
                      id=""
                      type="text"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Flat/Percentage"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Starting On:</label>
                    <input
                      id=""
                      type="date"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Date & Time"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Minimum Order Value:</label>
                    <input
                      id=""
                      type="number"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Number"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Expires On:</label>
                    <input
                      id=""
                      type="date"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Date & Time"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Maximum Discount:</label>
                    <input
                      id=""
                      type="number"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Number"
                    />
                    <small>(Incase of % Discount only)</small>
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Max Usage:</label>
                    <input
                      id=""
                      type="number"
                      className="form-control"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="How may times can it be used per user"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Vehicle Type Validity:</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="vehicleAll"
                          value="all"
                        />
                        <label className="form-check-label" htmlFor="vehicleAll">All</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="vehicle2Wheeler"
                          value="2wheeler"
                        />
                        <label className="form-check-label" htmlFor="vehicle2Wheeler">2 Wheeler</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="vehicle4Wheeler"
                          value="4wheeler"
                        />
                        <label className="form-check-label" htmlFor="vehicle4Wheeler">4 Wheeler</label>
                      </div>
                    </div>
                    <small>(In case of % Discount only)</small>
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Visibility:</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="Public"
                          value="Public"
                        />
                        <label className="form-check-label" htmlFor="Public">Public</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="Private"
                          value="Private"
                        />
                        <label className="form-check-label" htmlFor="Private">Private</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label mb-1">Payment Type Validity</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="Online"
                          value="Online"
                        />
                        <label className="form-check-label" htmlFor="Online">Online</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="COD"
                          value="COD"
                        />
                        <label className="form-check-label" htmlFor="COD">COD</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input !h-[1rem]"
                          type="radio"
                          name="vehicleTypeValidity"
                          id="AllTypes"
                          value="AllTypes"
                        />
                        <label className="form-check-label" htmlFor="AllTypes">All Types</label>
                      </div>
                    </div>
                    <small>Promocode valid for Selected payment Modes</small>
                  </div>
                  <div className="space-y-4 text-end">
                    <Button text="Submit" className="btn-dark" type="submit" />
                  </div>
                </div>
              </div>
            <div className="m-auto">
              <img src={AddPromoImg} alt="Promocode" width={450} />
            </div>
          </div>
          
        </form>
      </Card>
    </>
  );
};

export default AddPromocode2;
