$('.item--generating-btn').on('click', createListItem);
$('#bucket--list-display').on('click', $('.card--delete-btn'), deleteListItem);
window.onload = fetchBucketList();

async function createListItem(event) {
  event.preventDefault();
  $('#bucket--list-display').append(`
    <article class="bucket--list-card">
      <button class="card--delete-btn">DELETE</button>
      <h1>${$('.input-title').val()}</h1>
      <p>${$('.input-description').val()}
    </article>`);
  const title = $('.input-title').val();
  const body = $('.input-description').val();
  await postListItem({title, body});
}

async function deleteListItem(event) {
  const id = $(event.target).closest('article').attr('id');
  try {
    const url = '/api/v1/items/';
    const response = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({id}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    $(event.target).closest('article').remove();
  } catch(error) {
    throw Error(`Couldn't delete item from the database: ${error.status}`)
  }
} 

async function postListItem(bucket) {
  const url = 'http://localhost:3000/api/v1/items';
  const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(bucket),
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      }
    })
  const bucketListData = await response.json(); 
  clearInputs()
}

function clearInputs() {
  $('.input-title').val('');
  $('.input-description').val('');
}

async function fetchBucketList() {
  const response = await fetch('http://localhost:3000/api/v1/items');
  const info = await response.json();
  displayDB(info);
}

function displayDB(info) {
  info.forEach(i => {
    $('#bucket--list-display').append(`
    <article id=${i.id} class="bucket--list-card">
      <button class="card--delete-btn">DELETE</button>
      <h1>${i.title}</h1>
      <p>${i.body}
    </article>`);
  })
}