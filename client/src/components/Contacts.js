import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";

const Contacts = ({
  setNewContactModal,
  setShowEditModal,
  setReciever,
  setChatInEdit
}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const { chats: chatList, username } = state;

  return (
    <div
      className="form-control"
      style={{
        height: 500,
        width: 200,
        position: "relative"
      }}
    >
      {chatList &&
        chatList.map((item, index) => {
          const reciever =
            item.username1 !== username ? item.username1 : item.username2;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: 1,
                borderBottomColor: "black",
                borderBottomStyle: "solid"
              }}
            >
              <div
                className="contactItem"
                style={{
                  cursor: "pointer"
                }}
                key={index}
                onClick={e => {
                  dispatch({
                    type: "ChatInView",
                    payload: { ...item, reciever }
                  });
                  setReciever(reciever);
                }}
              >
                <span>{reciever}</span>
              </div>
              <div
                className="editItem"
                style={{
                  cursor: "pointer"
                }}
                onClick={() => {
                  setShowEditModal(true);
                  setChatInEdit(item);
                }}
              >
                . . .
              </div>
            </div>
          );
        })}
      <Button
        variant="primary"
        onClick={() => setNewContactModal(true)}
        style={{ position: "absolute", bottom: "0.375rem" }}
      >
        Add Contact
      </Button>
    </div>
  );
};

export default Contacts;
