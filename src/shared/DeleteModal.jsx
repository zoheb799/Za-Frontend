import { Dialog } from "primereact/dialog";
import React from "react";
import { Button } from "primereact/button";

const DeleteModal = ({
    visible,
    setVisible,
    handleDelete,
    disableDeleteBtn,
    confirmationText = "Are you sure you want to delete this record ?",
}) => {
    return (
        <>
            <Dialog
                header="Delete Confirmation"
                visible={visible}
                className="w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%]"
                style={{ width: "40vw", minWidth: "300px" }}
                onHide={() => setVisible(false)}
            >
                <div className="flex flex-col sm:flex-row items-center gap-3 p-2 text-center sm:text-left">
                    <i className="pi pi-info-circle icon-size"></i>
                    <span className="text-base sm:text-lg">
                        {confirmationText}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-5">
                    <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-primary w-full sm:w-auto"
                        onClick={() => setVisible(false)}
                    />
                    <Button
                        disabled={disableDeleteBtn}
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-danger"
                        onClick={handleDelete}
                    />
                </div>
            </Dialog>
        </>
    );
};

export default DeleteModal;
    