import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactItem = ({ contact }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/contact/${contact._id}`);
    };

    return (
        <div className='contact-tableDetails'>
        <table className="contact-table" onClick={handleClick}>
            <tbody>
                <tr className="contact-item">
                    <td>{contact.contactPerson}</td>
                </tr>
            </tbody>
        </table>
        </div>
    );
};

export default ContactItem;
