## Steps to run code

Run Services using: ```docker-compose up --build```

Stop Services using ```docker-compose down```
- **Frontend url**: [http://localhost:3000](http://localhost:3000)
- **Backend url**: [http://localhost:5000](http://localhost:5000)

---


## Thought Process (Frontend Focused)

### Part 1 (UI with Static JSON)

1. Stored the static json and used it as the default value while maintaining a state in the component.
3. On dragging and dropping, I store the index of the card that is dragged and the index where it is dropped, use this data to reorder the cards, using this updated array, I update the `position` of the actual state that is being maintained.
4. Clicking on the card opens a div whose visibiity is monitored by a boolean flag `isOverlayVisible`. The div takes the size of the whole screen, with fixed position and higher z-index it is visible on top of the cards UI. This can be closed by the close button or by pressing `esc` for which I've added an event listener on keypress.

---

### Part 2 & 3 (API Integration)
- I initially tried using `msw/browser` but after dockerizing it, nginx was not able to host it on the same port. So I decided to breakdown the application into 2 parts - backend and frontend

### Frontend
- Built a react application using vite.
- Components
    - Container - This is component contains the cards as well as the timer.
    - Card - Displays data received from the GET api.
    - Timer - Indicates when the cards were last refreshed on the frontend.
- Behaviour
    - The content gets loaded from the api initially.
    - If there are any changes in the order, then we save the data to backend every 5 secs.


### Backend 
- Created an express server that hosts the api (referred online resources for this as I was focusing more on the frontend).
    - GET `/cats` - returns the config, if data is not present in localStorage, then initialise it with the static json and save it in localStorage
    - PUT `/cats` - saves the updated config.

## Storage
- Initially I used `msw/browser` that allowed me to store data in localstorage of the browser, but when I moved to a backend - frontend microservice architecture, I felt using backend in memory storage makes more sense.

Note - Added a delay of 2 seconds to make sure the loading shimmer is visible.

---

### Part 4 (Deployment)
- `Dockerfile.frontend`: builds and runs the application on port 80
    - Port 80 is mapped to 3000
- `Dockerfile.backend`: runs `mockServer.js` on a node js env on port 5000
- `docker-compose.yml`: runs both the services in a container. 

---