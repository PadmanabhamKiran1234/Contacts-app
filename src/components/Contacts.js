import React, { useContext, useEffect, useState } from "react";
import contactContext from "../context/contacts/contactContext";
import ContactItem from "./ContactItem";
import SearchBar from "./SearchBar";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner"; 
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const context = useContext(contactContext);
  const { contacts, getAllContacts } = context;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentContacts, setCurrentContacts] = useState([]); 
  const [hasMore, setHasMore] = useState(true); 
  const [loading, setLoading] = useState(true);

  const CONTACTS_PER_PAGE = 10; 

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAllContacts();
    } else {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  // To show contacts based on search and infinite scroll
  useEffect(() => {
    if (contacts.length) {
      // Filter and sort contacts based on search
      const filteredContacts = contacts
        .filter((contact) =>
          contact.contactPerson.toLowerCase().startsWith(searchQuery.toLowerCase())
        )
        .sort((a, b) => a.contactPerson.localeCompare(b.contactPerson));
      
      // Handle infinite scroll
      const moreContacts = filteredContacts.slice(0, CONTACTS_PER_PAGE);
      setCurrentContacts(moreContacts);
      setHasMore(filteredContacts.length > CONTACTS_PER_PAGE);
      setLoading(false);
    }
  }, [contacts, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Fetch more contacts when scrolling
  const fetchMoreData = () => {
    // Filter and sort contacts based on search
    const filteredContacts = contacts
      .filter((contact) =>
        contact.contactPerson.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.contactPerson.localeCompare(b.contactPerson));

    if (currentContacts.length >= filteredContacts.length) {
      setHasMore(false); 
      return;
    }

    // Load remaining contacts after a delay
    setTimeout(() => {
      const moreContacts = filteredContacts.slice(
        currentContacts.length,
        currentContacts.length + CONTACTS_PER_PAGE
      );
      setCurrentContacts((prevContacts) => [...prevContacts, ...moreContacts]);
    }, 1000);
  };

  // Group contacts by the first letter (after sorting them)
  const groupedContacts = currentContacts
    .sort((a, b) => a.contactPerson.localeCompare(b.contactPerson)) 
    .reduce((groups, contact) => {
      const firstLetter = contact.contactPerson.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
      return groups;
    }, {});
 return (
    <div>
      <div className="sticky-searchbar">
        <SearchBar searchText={handleSearch} />
      </div>
      <div className="container">
        <div className="mx-3">
          {currentContacts.length === 0 && !loading && "No Contacts to display"}
        </div>

        {loading && <Spinner />}

        <InfiniteScroll
          dataLength={currentContacts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Spinner />}
        >
          {Object.entries(groupedContacts).map(([letter, contacts]) => (
            <div key={letter}>
              <h6>{letter}</h6>
              {contacts.map((contact) => (
                <ContactItem key={contact._id} contact={contact} />
              ))}
              <div style={{ marginBottom: "20px" }}></div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Contacts;
