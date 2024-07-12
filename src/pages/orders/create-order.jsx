import React from "react";
import Card from "../../components/ui/Card";
import Fileinput from '../../components/ui/Fileinput';
import Button from '../../components/ui/Button'

const CreateOrder = () => {
    return (
        <Card>
            <div className="md:flex justify-between items-center mb-6">
                <h4 className="card-title">Create Order</h4>                
            </div>
            <form>
                <Fileinput ></Fileinput>
                <div className="text-end">
                    <Button text="Submit" className="btn-dark mt-4 ms-auto" />
                </div>
            </form>
        </Card>
    );
}
export default CreateOrder;