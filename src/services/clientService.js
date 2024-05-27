import 'dotenv/config';


const API_URL = `${process.env.ME_API_URL}/clientes`;

// Logic to save the record in the database
const sendCustomerData = async (state) => {
  const customerData = {
    data: {
      name: state.get('fullName'),
      phone: state.get('phone'),
      city: state.get('city'),
      business: state.get('business'),
      date:  new Date().toISOString(), // Fecha actual en formato ISO
    }
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TOKEN_API // Add your authentication token if necessary
      },
      body: JSON.stringify(customerData)
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log('Customer created:', data);
    } else {
      const errorData = await response.json();
      console.error('Error creating customer:', response.statusText, errorData);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
};

export { sendCustomerData };
