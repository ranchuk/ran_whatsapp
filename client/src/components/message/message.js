import React from 'react';
import classnames from 'classnames';
const formatAMPM = require('../../utils').formatAMPM;

const Message = ({item, username, loader}) => {
    return <div className="message">
                              { !loader ? <div className={classnames(item.sender === username ? 'message_sender' : 'message_receiver')}>
                                <span className={classnames(item.sender === username ? 'message_sender_content' : 'message_receiver_content')}>
                                  {item.message}
                                </span>
                                <span className={classnames(item.sender === username ? 'message_sender_time' : 'message_receiver_time')}>
                                  {formatAMPM(new Date(item.time))}
                                </span>
                              </div> :
                                  <div className={classnames("message_receiver_content","message_receiver_content_writing")}>
                                    <span className="message_receiver_writing">
                                        <div className="loading-dots">
                                            <div className="loading-dots--dot"></div>
                                            <div className="loading-dots--dot"></div>
                                            <div className="loading-dots--dot"></div>
                                        </div>
                                    </span>
                                  </div>
        
                              }
            </div>;
}
 
export default Message;