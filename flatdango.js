document.addEventListener("DOMContentLoaded", () => {
  const filmsUrl = "db.json"; 
  const filmsList = document.getElementById("films");
  const poster = document.getElementById("poster");
  const title = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const showtime = document.getElementById("showtime");
  const availableTickets = document.getElementById("available-tickets");
  const buyTicketButton = document.getElementById("buy-ticket");

  let currentFilm;
  
  // Create an array to store the user's favorite films
  let favoriteFilms = [];  

  // Function to calculate the available tickets
  const calculateAvailableTickets = (capacity, ticketsSold) => {
    return capacity - ticketsSold;
  };

  // Function to handle the sold-out state of a film
  const handleSoldOutState = (filmElement, isSoldOut) => {
    if (isSoldOut) {
      buyTicketButton.textContent = "Sold Out";
      buyTicketButton.disabled = true;
      filmElement.classList.add("sold-out");
    } else {
      buyTicketButton.textContent = "Buy Ticket";
      buyTicketButton.disabled = false;
      filmElement.classList.remove("sold-out");
    }
  };

  // Function to update available tickets display
  const updateAvailableTickets = (filmElement) => {
    const ticketsLeft = calculateAvailableTickets(currentFilm.capacity, currentFilm.tickets_sold);
    availableTickets.textContent = `Available Tickets: ${ticketsLeft}`;
    handleSoldOutState(filmElement, ticketsLeft === 0);
  };

  // Function to display movie details when clicked
  const displayMovieDetails = (movie, filmElement) => {
    currentFilm = movie;
    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = `Runtime: ${movie.runtime} mins`;
    showtime.textContent = `Showtime: ${movie.showtime}`;
    updateAvailableTickets(filmElement);
  };

  // Function to toggle the favorite status of a film
  const toggleFavorite = (film, filmElement) => {
    // Check if the film is already in the favorites list
    const isFavorite = favoriteFilms.some(fav => fav.title === film.title);
    
    if (isFavorite) {
      // Remove from favorites
      favoriteFilms = favoriteFilms.filter(fav => fav.title !== film.title);
      filmElement.querySelector('.favorite-btn').textContent = "Add to Favorites";  // Reset button text
      filmElement.classList.remove("favorite"); // Remove the 'favorite' class
    } else {
      // Add to favorites
      favoriteFilms.push(film);
      filmElement.querySelector('.favorite-btn').textContent = "Remove from Favorites";  // Change button text
      filmElement.classList.add("favorite");  // Add the 'favorite' class for styling
    }

  };

  // Fetch films data from the JSON file
  fetch(filmsUrl)
    .then((response) => response.json())  // Parse the JSON data
    .then((data) => {
      const films = data.films;

      filmsList.innerHTML = ""; 

      films.forEach((film) => {
        // Create a list item for each film
        const li = document.createElement("li");
        li.textContent = film.title;
        li.classList.add("film", "item");

        // Create a "Delete" button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        // Create a "Favorite" button
        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("favorite-btn");
        favoriteButton.textContent = "Add to Favorites"; // Initial text
        
        // Add event listener to the "Favorite" button
        favoriteButton.addEventListener("click", (e) => {
          e.stopPropagation();  
          toggleFavorite(film, li); 
        });

        // Add event listener to delete button
        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteFilm(film, li);  // Call delete function
        });

        // Append the "Delete" and "Favorite" buttons to the list item
        li.appendChild(favoriteButton);
        li.appendChild(deleteButton);

        // Check if the film is sold out and add appropriate class
        const ticketsLeft = calculateAvailableTickets(film.capacity, film.tickets_sold);
        if (ticketsLeft === 0) {
          li.classList.add("sold-out");
        }

        // Add event listener to the list item to display film details when clicked
        li.addEventListener("click", () => {
          displayMovieDetails(film, li);
        });

        // Append the film list item to the films list
        filmsList.appendChild(li);
      });

      // Display the first film details by default
      if (films.length > 0) {
        const firstFilmElement = filmsList.querySelector("li");
        displayMovieDetails(films[0], firstFilmElement);
      }
    })
    .catch((error) => {
      console.error("Error fetching films data:", error);
    });

  // Event listener for the "Buy Ticket" button
  buyTicketButton.addEventListener("click", () => {
    if (currentFilm.tickets_sold < currentFilm.capacity) {
      currentFilm.tickets_sold += 1;

      const filmElements = document.querySelectorAll("#films .film");
      const currentFilmElement = Array.from(filmElements).find(
        (el) => el.textContent === currentFilm.title
      );

      updateAvailableTickets(currentFilmElement);
    }
  });

  // Function to delete a film from the list
  const deleteFilm = (film, filmElement) => {
    filmElement.remove(); // Remove the film element from the DOM


    // If the deleted film was the current one being displayed, reset the display
    if (currentFilm === film) {
      // Find the first remaining film and display its details if available
      const remainingFilms = document.querySelectorAll("#films .film");
      if (remainingFilms.length > 0) {
        displayMovieDetails(
          JSON.parse(remainingFilms[0].dataset.film), // Use your actual data structure
          remainingFilms[0]
        );
      } else {
        // Reset display if no films are left
        poster.src = "";
        title.textContent = "";
        runtime.textContent = "";
        showtime.textContent = "";
        availableTickets.textContent = "Available Tickets: 0";
        buyTicketButton.textContent = "Sold Out";
        buyTicketButton.disabled = true;
      }
    }
  };
});
