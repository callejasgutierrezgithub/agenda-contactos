<template>
  <!-- <div class="container"> -->
    <div class="table-container">

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre, email, país o ciudad"
        class="search-input"
      />
      <table class="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>País</th>
            <th>Ciudad</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!-- nuevo contacto -->
          <tr>
            <td>#</td>
            <td><input v-model="newContact.name" placeholder="Nombre" /></td>
            <td><input v-model="newContact.email" placeholder="Email" type="email" /></td>
            <td><input v-model="newContact.address" placeholder="Dirección" /></td>
            <td><input v-model="newContact.phone" placeholder="Teléfono" /></td>
            <td><input v-model="newContact.country" placeholder="País" /></td>
            <td><input v-model="newContact.city" placeholder="Ciudad" /></td>
            <td>
              <button class="btn add" @click="addContact">Agregar</button>
            </td>
          </tr>
          <tr v-for="contact in filteredContacts" :key="contact.id">
            <td>{{ contact.id }}</td>
            <td>{{ contact.name }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.address }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.country }}</td>
            <td>{{ contact.city }}</td>
            <td>
              <button class="btn edit" @click="editContact(contact)">Editar</button>
              <button class="btn delete" @click="deleteContact(contact.id)">Eliminar</button>
            </td>
          </tr>        
        </tbody>
      </table>

      <div v-if="showEditModal" class="modal-backdrop">
    <div class="modal-content">
      <h2>Editar Contacto</h2>
      <label>
        Nombre:
        <input v-model="selectedContact.name" class="search-input" />
      </label>
      <label>
        Email:
        <input v-model="selectedContact.email" class="search-input" />
      </label>
      <label>
        Dirección:
        <input v-model="selectedContact.address" class="search-input" />
      </label>
      <label>
        Teléfono:
        <input v-model="selectedContact.phone" class="search-input" />
      </label>
      <label>
        País:
        <input v-model="selectedContact.country" class="search-input" />
      </label>
      <label>
        Ciudad:
        <input v-model="selectedContact.city" class="search-input" />
      </label>

      <div style="display: flex; justify-content: end; gap: 10px; margin-top: 1rem;">
        <button class="btn delete" @click="closeModal">Cancelar</button>
        <button class="btn edit" @click="saveEdit">Guardar</button>
      </div>
    </div>
    </div>
    </div>  
  
</template>

<script>
import { computed } from 'vue';
export default {
  name: 'GrillaView',
  data() {
    return {
      selectedContact: null,
      showEditModal: false,
      searchQuery: '',
      contacts: [],

      newContact: {
        name: "",
        email: "",
        address: "",
        phone: "",
        country: "",
        city: "",
      },
    };
  },

  mounted() {
    fetch('http://localhost:3000/contacts')
      .then(res => res.json())
      .then(data => {
        this.contacts = data;
      });
  },


  computed: {
    filteredContacts() {
      const query = this.searchQuery.toLowerCase();
      return this.contacts.filter(contact =>
        (contact.name || '').toLowerCase().includes(query) ||
        (contact.email || '').toLowerCase().includes(query) ||
        (contact.country || '').toLowerCase().includes(query) ||
        (contact.city || '').toLowerCase().includes(query)
      );

    }
  },

  methods: {
    editContact(contact) {
      console.log('Editar contacto:', contact);
      this.selectedContact = { ...contact }; // clonar para no modificar directamente
      this.showEditModal = true;
    },

    deleteContact(id) {
      fetch(`http://localhost:3000/contacts/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) {
            this.contacts = this.contacts.filter(contact => contact.id !== id);            
          } else {
            console.error('Error al eliminar contacto');
          }
        })
        .catch(error => {
          console.error('Error al eliminar:', error);
        });
    },

    addContact() {
      const contactToAdd = {
        ...this.newContact,
      };

      fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactToAdd)
      })
        .then(res => res.json())
        .then(saved => {
          this.contacts.push(saved);
          this.newContact = {
            name: "", email: "", address: "", phone: "", country: "", city: ""
          };
        });
    },

    closeModal() {
      this.showEditModal = false;
      this.selectedContact = null;
    },
    saveEdit() {
      const id = this.selectedContact.id;

      fetch(`http://localhost:3000/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.selectedContact)
      })
        .then(res => {
          if (res.ok) {
          
            const index = this.contacts.findIndex(c => c.id === id);
            if (index !== -1) {
              this.contacts.splice(index, 1, { ...this.selectedContact });
            }
            this.closeModal();
            console.log(`Contacto con ID ${id} actualizado.`);
          } else {
            console.error('Error al actualizar contacto');
          }
        })
        .catch(error => {
          console.error('Error de red al actualizar contacto:', error);
        });
    }

  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-content input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

.btn {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn.edit {
  background-color: #0cb1fd;
  color: white;
}

.btn.edit:hover {
  background-color: #0894d6;
}

.btn.delete {
  background-color: #f44336;
  color: white;
}

.btn.delete:hover {
  background-color: #d32f2f;
}

.btn.add {
  background-color: #4caf50;
  color: white;
}

.btn.add:hover {
  background-color: #388e3c;
}

/* INPUT BUSCADOR */
.search-input {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  border: 1px solid #ced4da;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  box-sizing: border-box;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  min-width: 800px; 
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-container {
  margin: 0px;
  
  padding: 1rem;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.2rem;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.custom-table thead {
  background-color: #0cb1fd;
  color: white;
}

.custom-table th,
.custom-table td {
  padding: 7px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  font-size: 12px;
}

.custom-table tbody tr:hover {
  background-color: #f1f3f5;
  transition: background-color 0.3s;
}
</style>
