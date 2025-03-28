import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import Icon from "@/components/ui/Icon";

const Modal = ({
  activeModal,
  onClose,
  noFade,
  disableBackdrop,
  className = "max-w-xl",
  children,
  footerContent,
  centered,
  scrollContent,
  themeClass = "dark:bg-slate-800 dark:border-b dark:border-slate-700",
  title = "",
  uncontrol,
  label = "Basic Modal",
  labelClass,
  ref,
}) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(!showModal);
  };
  const returnNull = () => {
    return null;
  };

  return (
    <>
     
        <Transition appear show={activeModal} as={Fragment}>
          <Dialog as="div" className="relative z-[99999]" onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter={noFade ? "" : "duration-300 ease-out"}
              enterFrom={noFade ? "" : "opacity-0"}
              enterTo={noFade ? "" : "opacity-100"}
              leave={noFade ? "" : "duration-200 ease-in"}
              leaveFrom={noFade ? "" : "opacity-100"}
              leaveTo={noFade ? "" : "opacity-0"}
            >
              {!disableBackdrop && (
                <div className="fixed inset-0  backdrop-filter backdrop-blur-sm" />
              )}
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div
                className={`flex min-h-full justify-center text-center p-6 ${
                  centered ? "items-center" : "items-start "
                }`}
              >
                <Transition.Child
                  as={Fragment}
                  enter={noFade ? "" : "duration-300  ease-out"}
                  enterFrom={noFade ? "" : "opacity-0 scale-95"}
                  enterTo={noFade ? "" : "opacity-100 scale-100"}
                  leave={noFade ? "" : "duration-200 ease-in"}
                  leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                  leaveTo={noFade ? "" : "opacity-0 scale-95"}
                >
                  <Dialog.Panel
                    className={`w-full transform overflow-hidden rounded-md
                 bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-alll ${className}`}
                  >
                    <div
                      className={`relative overflow-hidden py-3 px-4 flex items-center justify-between border-bottom  ${themeClass}`}
                    >
                      <h2 className="capitalize text-lg text-base">
                        {title}
                      </h2>
                      <button onClick={onClose} className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Close
                        <Icon className="text-[22px]" icon="heroicons-outline:x" />
                      </button>
                    </div>
                    <div
                      className={`px-6 py-3 ${
                        scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                      }`}
                    >
                      {children}
                    </div>
                    {footerContent && (
                      <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
                        {footerContent}
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      
    </>
  );
};

export default Modal;
