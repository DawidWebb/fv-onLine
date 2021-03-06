import { useDispatch, useSelector } from "react-redux";
import {
  addSpinner,
  clearClentState,
  clearInvoice,
  deleteInvoice,
  removeSpinner,
  timeoutShowTask,
} from "../../data/actions";
import request from "../../helpers/request";

import { Button, Modal } from "..";
import styles from "./deleteConfirmation.module.scss";

const DeleteConfirmation = ({
  isModalOpen,
  setIsModalOpen,
  id,
  deleteItem,
}) => {
  const testBase = useSelector((store) => store.testBase);
  const dispatch = useDispatch();

  const handleOnDelete = async () => {
    dispatch(addSpinner());
    if (testBase) {
      if (deleteItem === "clientToDel") {
        localStorage.removeItem("client");
        dispatch(clearClentState());
        dispatch(removeSpinner());
        setIsModalOpen(false);
      } else {
        localStorage.removeItem("invoice");
        dispatch(clearInvoice());
        dispatch(removeSpinner());
        setIsModalOpen(false);
      }
    } else {
      try {
        const { status } = await request.delete(`/invoice/${id}`);
        if (status === 200) {
          dispatch(deleteInvoice(id));
          dispatch(removeSpinner());
          dispatch(timeoutShowTask("Usunięto fakturę"));
        }
      } catch (error) {
        dispatch(removeSpinner());
        console.warn("cos nie tak");
      }
    }
  };

  const handleOnClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal isModalOpen={isModalOpen}>
      <div className={styles.wrapper}>
        <p>Czy na pewno chcesz usunać?</p>
        <div className={styles.buttons}>
          <Button name="usuń" onClick={handleOnDelete} />
          <Button name="wyjdź" onClick={handleOnClose} />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
