# Sweet Notes 🌷

A cute, responsive mini notes app built with React + Vite. It is ready to run locally and deploy to Azure Static Web Apps.

## Features
- Create, edit, delete and pin notes
- Search notes and filter by category
- Six pastel note colours
- Automatic browser LocalStorage persistence
- Import/export JSON backups
- Responsive layout and friendly empty states
- No backend or environment variables required

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```
The production output is generated in `dist/`.

## Deploy to Azure Static Web Apps (GitHub workflow)
1. Push this project to a GitHub repository.
2. In the Azure Portal, create **Static Web App**.
3. Choose the subscription/resource group, name, and region.
4. Select **GitHub** as the deployment source and authorize the repository.
5. Set build details:
   - Build preset: **React**
   - App location: `/`
   - API location: *(leave blank)*
   - Output location: `dist`
6. Select **Review + create**, then **Create**.
7. Azure adds a GitHub Actions workflow. Open the repository's **Actions** tab to watch the deployment.
8. When the workflow succeeds, open the Azure Static Web App URL.

## Demo talking points
- React components and state drive the note editor and filters.
- LocalStorage persists notes in the browser without a backend.
- Vite creates an optimized production bundle in `dist`.
- Azure Static Web Apps builds and hosts the frontend, with GitHub Actions handling CI/CD.
- Make a small UI change, push it to GitHub, and show the next workflow run deploying it automatically.

## Notes
- This demo stores data in the current browser only. It does not sync between devices or users.
- For a fresh demo, use the seeded sample notes or clear the app's LocalStorage in browser devtools.
