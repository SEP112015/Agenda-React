import React, { useState, useEffect } from "react";
import "./styles.css";

const ContactForm = ({ onAddContact }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !telefono) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const newContact = { nombre, apellido, telefono };

    try {
      const response = await fetch("http://www.raydelto.org/agenda.php", {
        method: "POST",
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        alert("Contacto agregado exitosamente");
        onAddContact(newContact);
        setNombre("");
        setApellido("");
        setTelefono("");
      } else {
        throw new Error("Error al agregar el contacto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo agregar el contacto");
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar Nuevo Contacto</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        <button type="submit">Agregar Contacto</button>
      </form>
    </div>
  );
};

const ContactList = ({ contacts }) => {
  return (
    <div className="contacts-container">
      <h2>Lista de Contactos</h2>
      <div id="contactsList">
        {contacts.length === 0 ? (
          <p>No hay contactos disponibles</p>
        ) : (
          contacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <strong>Nombre:</strong> {contact.nombre} {contact.apellido}
              <br />
              <strong>Teléfono:</strong> {contact.telefono}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://www.raydelto.org/agenda.php");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error al cargar los contactos:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  return (
    <div className="container">
      <h1>Agenda Web</h1>
      <ContactForm onAddContact={handleAddContact} />
      <ContactList contacts={contacts} />
    </div>
  );
};

export default App;
