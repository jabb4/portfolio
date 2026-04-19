# Portfolio

Simple dark-mode portfolio site built for GitHub Pages.

## Structure

- `index.html` is the homepage.
- `assets/css/site.css` contains the shared styles.
- `assets/js/content.js` contains your intro, contact details, and project data.
- `assets/js/site.js` renders the homepage, project dropdown, contact section, and project pages.
- `projects/<slug>/index.html` is one dedicated page per project.

## Customize

Update `assets/js/content.js` and replace:

- `profile.name`
- `profile.email`
- `profile.github`
- `profile.linkedin`
- The intro copy
- The project entries in `projects`

## Add A New Project Page

1. Add a new project object to `assets/js/content.js`.
2. Copy one of the existing folders inside `projects/`.
3. Rename the folder to match the new project `slug`.
4. Update `data-project-slug` in that folder's `index.html`.

The project dropdown is generated from `assets/js/content.js`, so new entries show up there automatically.

## Publish On GitHub Pages

1. Push the repository to GitHub.
2. Open repository `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select the `main` branch and `/ (root)` folder.
5. Save and wait for GitHub Pages to publish the site.
