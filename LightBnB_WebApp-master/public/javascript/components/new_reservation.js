$(() => {
  const $newReservation = $(`
  <form action="/newReservation" method="POST">
    <input type="text" placeholder="YYYY-MM-DD">
    <input type="text" placeholder="YYYY-MM-DD">
    <button type="submit">PLACE RESERVATION</button>
  </form>
  `);

  window.$newReservation = $newReservation;

  $newReservation.on('submit', function(event) {
    // const data = $(this).serialize();

    //BETTER WAY OF GETTING THIS DATA?//
    const startDate = this[0].value;
    const endDate = this[1].value;
    const dates = [startDate, endDate];
    console.log('dates-->', dates);
    event.preventDefault();

  }); //end submit
  
}); //end ready
//   retunn some confirmation HERE
//   using .then????
//   and another function (to be defined????)