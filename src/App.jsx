import React, { useEffect, useState } from 'react';
import './index.css'; // Import the CSS file

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [highlightOldest, setHighlightOldest] = useState(false);

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched users:', data.users); // Debug: Log fetched users
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (nameFilter) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(nameFilter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (cityFilter) {
      filtered = filtered.filter(user => user.address.city === cityFilter);
    }

    if (highlightOldest) {
      const oldestUsersByCity = {};

      filtered.forEach(user => {
        if (!oldestUsersByCity[user.address.city] || user.age > oldestUsersByCity[user.address.city].age) {
          oldestUsersByCity[user.address.city] = user;
        }
      });

      filtered = filtered.map(user => 
        user.id === oldestUsersByCity[user.address.city]?.id ? { ...user, highlight: true } : user
      );
    }

    setFilteredUsers(filtered);
  }, [nameFilter, cityFilter, highlightOldest, users]);

  const cities = Array.from(new Set(users.map(user => user.address.city)));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          className="search-input" // Apply the CSS class
        />
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="checkbox"
            checked={highlightOldest}
            onChange={e => setHighlightOldest(e.target.checked)}
          />
          Highlight Oldest
        </label>
      </div>
      <ul>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', fontWeight: 'bold' }}>
          <span>Name</span>
          <span>City</span>
          <span>Birthday</span>
        </li>
        {filteredUsers.map(user => (
          <li key={user.id} style={{ display: 'flex', justifyContent: 'space-between', background: user.highlight ? 'yellow' : 'white', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc' }}>
            <span>{user.firstName} {user.lastName}</span>
            <span>{user.address.city}</span>
            <span>{formatDate(user.birthDate)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
