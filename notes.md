COMPLETE FLOW :

1. frontend (react):
    - user clicks "login"
    fetch ('/api/auth/login', {method: 'POST', body: ...})


2. server (server.js)
    - receives the request to api/auth/login
    looks at mounted routes:
    "anything starting with api/auth => got to the routes/auth.js"

3. route file (routes/auht.js)
    - matches post/login
    runs the handler function

4. handler does the work:   
    - vlaidates input 
    quesries the datbase
    creates a token
    sends response back

5. frontend recives response 
    - stores token 
    redirects to home page





*** why does react (frontend) need a router => React is a single page application [SPA], so we need to manually handle what content shows where.

*** react router does this using URL and tells react what component to render based on the current route. [ without actually refreshing the page so it maintains the smooth SPA experience. ]


*** hooks in react ----> stores the actual memeory in react 
*** hook useState => memory part [it takes the initial or curretn state and returns the updated state ]


*** useEffect [side effect hook] => tells react that our component needs to do something  after it render i.e. fetching data from an API , interecting directly with the browser DOM , or setting up timers basically anything after redering.


*** login page :
- user submits form
- login page calls backend api/auth/login
- backend returns token + success
- loginPage calls setisloggedin(true) [function pass from app.js]
- ap.js sees islogged in true and sutomatically shows dashboard 


*** app.js => is the traffic controller , it decides which page to show based on the state


login  Page only handles : [and also the look of the page]
- display the form 
- call the api 
update the state 
show success message (optional)

*** handle function :
- functions we write to react to user actions
- such as typing text into a field or clicking button  



FeatureFile🎨 Icon picker (when creating folder)DashboardPage.jsx🔍 Search folders (wire to backend)DashboardPage.jsx📊 Rank by confidence (0, 1, 2)FolderPage.jsx🔍 Search questionsFolderPage.jsx



