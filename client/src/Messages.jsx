import React from 'react';

const Messages = ({data, sessionUser}) => {
    const date = new Date(data.data)
    return (
        <div style={{"width": '60%'}}>
            <div style={{
                "display": "flex",
                ...sessionUser.id === data.user.id ? {
                    "justifyContent": "end",
                } : {}
            }
            }>
                <div style={{
                    "margin": "3px 0",
                    "display": "inline-block",
                    "backgroundColor": sessionUser.id === data.user.id ? "#359241" : "#923535",
                    "padding": "14px",
                    "borderRadius": sessionUser.id === data.user.id ? "15px 15px 0 15px" : "15px 15px 15px 0",
                    "color": "white"
                }}>
                    <i style={{fontSize: "12px", display: "inherit"}}>
                        <b>{sessionUser.id === data.user.id ? "Eu" : data.user.name}</b>  às {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} às ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}
                    </i>
                    <span style={{fontSize: "22px"}}>{data.message}</span>
                </div>
            </div>
        </div>
    );
};

export default Messages;
