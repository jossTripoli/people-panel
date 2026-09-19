# People Panel
This project is a user management UI for an application administrator. I assume that the administrators are not highly technical users, so I'll aim to make it approachable. For example, I will make it more like the management UIs of Wordpress or Shopify, rather than say AWS IAM (Identity and Access Management). I'll prioritize clear terminology, efficient workflows, and familiar interaction patterns.

## Live Demo
View the deployed application at:  
https://people-panel.vercel.app/

## Architecture Decisions
I’ve designed and built several admin and internal dashboards before, so the core problem is familiar. At DART Collective, I worked on dashboards for managing users, learner analytics, donors and donations, course creation, and educator workflows. At MiniNature Reserve, I built a custom admin dashboard that lets the team manage site content, team member profiles, and permissions for tasks like authoring blog posts.

These projects exposed me to real architecture tradeoffs, most notably the importance of how the app is structured from the start. For this admin product, one consideration is whether it should live inside the main application or as a separate frontend. Keeping it monolithic can simplify authentication, shared components, deployment, and access to business logic. The tradeoff is that as the product grows, it can become harder to scale different parts of the system independently. For example, if the admin interface and customer-facing product have very different traffic or resource needs, a monolithic deployment may require scaling the entire application together. A separate admin application creates a cleaner boundary and can be scaled independently, such as running additional instances only where demand requires it, but it adds more infrastructure and coordination between the frontend and backend.

For this project, I’ll make the admin UI with a clearly separated API layer. I’m choosing Angular and Tailwind CSS because they align with the team’s existing stack and give me a chance to work in the same kind of environment I would be using on the job. Like other frontend frameworks I’ve used, including React and Vue, Angular is well suited for building single-page applications with reusable components and smooth navigation between views which is great for user experience. Tailwind CSS will help me move quickly while keeping spacing, responsive behavior, and interaction states consistent across the application.

## Approach
I’m approaching this project differently from my usual design process. I believe that good frontend design starts with being informed. This means understanding the problem, business goals, brand identity, competition, and most importantly the users before building a solution. My approach is influenced by my experience with the Design Thinking process (Empathize, Define, Ideate, Prototype, and Test), which I learned hands-on while working at Lehigh’s Human Computer Interaction and Social Computing Research Lab and through NSF I-Corps programs. These experiences taught me to think carefully about user needs, value propositions, and how product decisions connect to business objectives.

For this project, much of that context is not available, so the design is necessarily speculative. I’m using the provided requirements as my source of truth and making reasonable assumptions where needed. The needs established in the brief are: top navigation, an efficient user-management workflow, accessibility, scalability to a large user base, and clear handling of different application states and API interactions. One area not called out directly in the brief is auditability and compliance which is essential for a product like this, so I’ll add it as an additional consideration. I’ll start by outlining my thinking for each of these areas. From there, I’ll create the design in Figma and then implement it using Angular and Tailwind CSS.

### Navigation 
The spec calls for a top navigation bar, so that is what I will implement. However I would recommend using a collapsible navigation sidebar instead as it scales better as nav items grow and doesn't compete with content for vertical space. For the navbar items I will have the user management page listed as “Users”. This is concise, clear, easy-to-scan, and immediately communicates what the section contains without being verbose like if called “User Management UI”. I also have entries for “Dashboard” which will be where the admin user is first taken to after logging in and contain a high level overview of the system including information like KPIs, recent activity, system status, alerts, etc. For the audit log I'll make the entry "Activity" as this communicates it in a much more approachable way. Lastly, I have a circular profile badge for where the logged in user will be shown and able to access account settings.

### User Management 
Managing users is the core of the application so I will design the primary interface as a data table that makes it easy to scan, search, filter, sort, and take action on users. However from working with them in the past I know there are many pitfalls to them like it being easy to overwhelm users, poor responsiveness with the horizontal and vertical scrollbars on smaller screens, and unclear feedback on states. To avoid overwhelming the user with too much data but still make it easier to add more fields as needed while the product scales, rather than inline table editing I’m using a side panel. On mobile the panel can become a full-screen sheet. To make the table responsive I will make it break down into a stacked list on narrow screens. I’ll add toast status messages and loading indicators like skeleton loaders to show state. 

### Accessibility 
I am considering accessibility throughout the design rather than treat it as a separate feature. I am using semantic HTML and native elements wherever possible so that controls such as buttons, forms, tables, and navigation work predictably with keyboards and assistive technologies. In the visual design I am using clear color contrast, understandable instructions, strong text hierarchy, readable typography, and visible interaction states. Developing with accessibility will allow me to provide good user experience and a clear maintainable interface throughout the application.

### Scalability 
I’m designing the system so it can grow over time. Instead of loading all users into the browser at once, which becomes slower and more resource-intensive as the user base grows, I’m using server-side search, filtering, sorting, and pagination so the frontend only requests and renders the data it currently needs. I’m also breaking the interface into reusable components, making it easier to extend while keeping patterns consistent throughout the application.

### Auditability 
One area not called out directly in the brief is auditability and compliance. For an admin dashboard, I think this is especially important because administrators can make changes that affect other users. I plan to add an activity log that shows who performed the action, which user was affected, what changed, and when it occurred so there is a clear history of what happened and when. I’m not implementing areas like authentication, access control, or additional security safeguards since authentication is outside the scope of this project.

I feel like now I've thought about the work sufficiently and will move on to designing it.

# Design
View the design in [Figma](https://www.figma.com/design/t6HIaI4hYzc77uESqc8Was/people-panel?node-id=0-1&t=PYEtPzrMz4qKoQPb-1).

I will be using Figma to design it as it has lots of features like responsive auto layout, frames, and color palettes that make it much quicker and easier to design user interfaces. As I'm designing in isolation I will use this to figure out how I want it to look rather than build out a full wireframe for user testing. I'm starting by collecting screenshots of my past and other companies user manager UIs for inspiration. Next I'm bringing in the tailwind css colors and developing brand identity. I really enjoy blue for building trust but wanted to go with something a little more modern and approachable then a traditional coporate navy blue so I picked a shade of teal for the primary color. Next I choose a secondary lighter teal and an accent golden yellow, and a light stone for the background. Since I'm designing with a top navbar I don't want it to feel heavy weighing down the site or distracting from the main user management table, so I'm going to keep it light and just use a bottom border to seperate it from the rest of the page. I came up with the name "PeoplePanel" for the prand since I think the alliteration is fun and it represents the product well. Next I used procreate to sketch some logo ideas using this name and colors. I decided on two Ps with user icons over the them with the hole being the icons' heads. I then created the vector artwork so it will be responsive and work well in the web app. 

I'm creating the navbar using figma autolayout so it's easy to update the navbar items and components without having to manually adjust everything. I'm putting the primary navigation to the left after the logo to make it easy to access as well as create hierarchy with the lesser used account controls to the right. Under the navbar I'm putting breadcrumbs to give users additional context about where they are within the application and provide a pattern that can scale as deeper pages are introduced. I prefer to use carets to seperate the items and they communicate the direction which is more informational than slashes or dots. Below the breadcrumbs, each page has a clear title and short description. I'm making the desciptions functional of what the users would want to do on the page. Below that will be the user table itself.

I have a good sense of how I want it to look so will move on to coding it.

# Development
I'm starting by going through the [Angular Documentation](https://angular.dev/overview). I like to learn new frameworks this way as its the most up to date information and I learn best by gaining a good understanding of it and then actively figuring things out myself rather than passively watching videos or llms. 

While developimg I will use clear naming, keep components manageable, and add comments to explain logic. I see that in [Angular 22](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664) developers can now add comments in HTML elements. In order to make it easy to change colors in future as well as implement dark mode I will define tailwind css color theme in styles.css rather than using tailwind's color directly.


[Angular coding style guide](https://angular.dev/style-guide)

[Generate Component](https://angular.dev/cli/generate/component)
```
ng generate component [name] [options]
ng g c [name] [options]
```

use standard 'class' unlike react which requires className

[For block](https://angular.dev/api/core/@for)
```
@for (item of items; track item.name) {
  <li>{{ item.name }}</li>
} @empty {
  <li>There are no items.</li>
}
```

[Binding dynamic text / text interpolation](https://angular.dev/guide/templates/binding)

### User Object Model
For the user object, I’m adding createdAt and updatedAt timestamps alongside the fields defined in the brief. I’m intentionally keeping the model limited to those fields so I can satisfy the project requirements without introducing unnecessary scope.

There are several additional fields that could be useful in a production system, but each brings product or technical decisions that are outside the scope of this exercise. For example, an emailVerified field would depend on how authentication and verification are handled. Profile images would introduce concerns around file storage, uploads, broken image states, and content moderation. Suspension could also be modeled separately from status, with fields such as a reason, start time, or expiration date, but that would require defining a more detailed account-restriction workflow.

Keeping the model small lets me focus on the core user management experience while leaving room for those capabilities to be added later if the product requirements call for them.

### API Service
[Creating and using services](https://v20.angular.dev/guide/di/creating-and-using-services?utm_source=chatgpt.com)

I'm using an Angular service for the user API so the data logic stays separate from the page components. The service will handle listing, creating, updating users, pagination, headers, and errors. For this project I'm having it use an in-memory store but keeping the API behind a service will make it easy to swap for a real backend later without changing the UI.

```
ng generate service features/users/users-api
```

Responses use a shared HTTP-style structure. For example, GET /users returns:

```ts
{
  status: 200,
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    items: User[],
    total: number
  }
}
```
| Method | Route                       | Purpose                 |
| ------ | --------------------------- | ----------------------- |
| `GET`  | `/users`                    | List users              |
| `GET`  | `/users/:id`                | Get a single user       |
| `POST` | `/users`                    | Create a user           |
| `PUT`  | `/users/:id`                | Update a user           |
| `POST` | `/users/:id/password-reset` | Reset a user's password |

### Frontend Integration

The user management UI is wired to the in-memory API service rather than reading or mutating the user store directly. I am using the Angular template-driven forms:

- [Template-driven forms](https://angular.dev/guide/forms/template-driven-forms)
- [FormsModule API](https://angular.dev/api/forms/FormsModule)

Since there will be many users I am going to add pagination that is in a fixed bar so when changing how many rows to view at once it won't be pushed down the page. I'm also giving the clear information about what page they are on and how many users they are viewing.

### Loading States & Editing for User Details

Because the API is backed by an in-memory store the requests are complete almost immediately. To make loading states visible and demonstrate how the interface would behave with real network latency I'm adding a short simulated delay using `setTimeout` when clicking to view the user. I'm using angular's `ChangeDetectorRef` to update the view after the delayed operation completes. Tailwind css animation makes it very easy to add the pulsating skeleton loaders.

- [ChangeDetectorRef](https://angular.dev/api/core/ChangeDetectorRef)

The sidebar supports separate view and edit states. When editing begins, the current user values are copied into an `UpdateUserRequest` model so changes can be made without mutating the displayed user before the update succeeds. Saving changes calls `PUT /users/:id` and sends the ETag from the most recent `GET /users/:id` request through `If-Match`. If the update succeeds, the sidebar stores the updated user and the new ETag returned by the API, then refreshes the current table page so the edited values are reflected immediately. If the stored ETag is stale, the API returns `412 Precondition Failed`. The UI handles this separately from other errors so the administrator is told that the record changed after it was opened and presented with recovery actions.

### Edit Conflict Recovery

When an update returns `412 Precondition Failed`, the sidebar UI gives the administrator two explicit recovery choices.

In the UI, I use the labels **Discard my changes** and **Keep my changes** instead of reload and overwrite as described in the brief because they describe the outcome in terms of the administrator's current edits rather than the underlying HTTP behavior. This makes the recovery options clearer to someone who does not need to understand ETags or optimistic concurrency.

## Next Steps
If I had more time these are features I would consider adding:
- Filtering and Sorting
- Make status a colored status badge instead of plain text
- Add skeleton loaders to rest of components
- Dark mode support
- Checkboxes next to each user to allow for selecting multiple for bulk actions
- Exporting info into spreadsheet
- Implement the dashboard and activity pages