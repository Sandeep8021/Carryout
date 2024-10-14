import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MenuPage() {
  const [menu, setMenu] = useState([]);
/*
  useEffect(() => {
    axios.get('/api/menu')
      .then(res => setMenu(res.data))
      .catch(err => console.error(err));
  }, []);*/

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menu.map(item => (
          <div key={item.id} className="border p-4 rounded shadow">
            <h2 className="text-xl">{item.name}</h2>
            <p>{item.description}</p>
            <p>${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;
