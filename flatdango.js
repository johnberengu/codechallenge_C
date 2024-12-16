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


  const calculateAvailableTickets = (capacity, ticketsSold) => {
    return capacity - ticketsSold;
  };


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

  const updateAvailableTickets = (filmElement) => {
    const ticketsLeft = calculateAvailableTickets(currentFilm.capacity, currentFilm.tickets_sold);
    availableTickets.textContent = `Available Tickets: ${ticketsLeft}`;
    handleSoldOutState(filmElement, ticketsLeft === 0); 
  };

  const displayMovieDetails = (movie, filmElement) => {
    currentFilm = movie;
    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = `Runtime: ${movie.runtime} mins`;
    showtime.textContent = `Showtime: ${movie.showtime}`;
    updateAvailableTickets(filmElement); 
  };

  fetch(filmsUrl)
    .then((response) => response.json())
    .then((data) => {
      const films = data.films;

      filmsList.innerHTML = "";

      films.forEach((film) => {
        const li = document.createElement("li");
        li.textContent = film.title;
        li.classList.add("film", "item");

        const ticketsLeft = calculateAvailableTickets(film.capacity, film.tickets_sold);
        if (ticketsLeft === 0) {
          li.classList.add("sold-out");
        }
        li.addEventListener("click", () => {
          displayMovieDetails(film, li);
        });

        filmsList.appendChild(li);
      });

      if (films.length > 0) {
        const firstFilmElement = filmsList.querySelector("li");
        displayMovieDetails(films[0], firstFilmElement);
      }
    })
    .catch((error) => {
      console.error("Error fetching films data:", error);
    });

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
});
