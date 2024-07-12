import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Textinput from "../../components/ui/Textinput";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea" 


const AddHomePage = () => {
    
  return (
    <Card>
        <div className="card-header md:flex justify-between items-center mb-5 px-0">
            <div className="flex items-center">
                <Link to="/">
                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                </Link>
                <h4 className="card-title ms-2">Add Home Page</h4>
            </div>
        </div>
        <div className="">
            
        </div>
    </Card>
  );
};

export default AddHomePage;
