document.addEventListener("DOMContentLoaded", () => {
    var selectedMovieId = localStorage.getItem("selectedMovieId");fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(movies => {
        const filmsList = document.getElementById("films");
        movies.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("film", "item");
        li.textContent = movie.title;
        li.addEventListener("click", () => {localStorage.setItem("selectedMovieId", movie.id);
            fetch(`http://localhost:3000/films/${movie.id}`)
            .then(response => response.json())
            .then(movieDetails => {
                var buyTicketBtn = document.getElementById("buy-ticket");
                var movieTitle = document.getElementById("title");
                var movieRuntime = document.getElementById("run-time");
                var moviePoster = document.getElementById("poster");
                var movieTicketsAvailable = document.getElementById("tickets");
                var movieShowtime = document.getElementById("show-time");
                movieTitle.textContent = movieDetails.title;
                moviePoster.src = movieDetails.poster;
                movieShowtime.textContent = `Showtime: ${movieDetails.showtime}`;
                movieRuntime.textContent = `Runtime: ${movieDetails.runtime} minutes`;
                var ticketsAvailable = movieDetails.capacity - movieDetails.tickets_sold;
                movieTicketsAvailable.textContent = `Tickets Available: ${ticketsAvailable}`;
                buyTicketBtn.disabled = ticketsAvailable === 0;buyTicketBtn.addEventListener("click", event => {
                event.preventDefault();if (ticketsAvailable > 0) {
                    fetch(`http://localhost:3000/films/${movie.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },body: JSON.stringify({
                        tickets_sold: movieDetails.tickets_sold + 1 })})
                    .then(response => response.json())
                    .then(updatedMovieDetails => {
                        movieDetails = updatedMovieDetails;
                        ticketsAvailable = movieDetails.capacity - movieDetails.tickets_sold;
                        movieTicketsAvailable.textContent = `Tickets Available: ${ticketsAvailable}`; if (ticketsAvailable === 0) {
                        buyTicketBtn.disabled = true;
                        buyTicketBtn.textContent = "Sold Out";} })
                    .catch(error => {
                        console.log("Error updating ticket count:", error); });} }); }) .catch(error => {
                console.log("Error fetching movie details:", error);
            });
        });
        if (selectedMovieId && movie.id === selectedMovieId) {
        li.click();
        }filmsList.appendChild(li);
        });
    })
    .catch(error => {  console.log("Error fetching movie menu:", error);
    });
});