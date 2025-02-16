# Restaurant Admin App

This project is an **administrative application for restaurant management**, developed as part of a **thesis project**. It enables restaurant staff to efficiently manage products, collections, and orders. The application is built using **Next.js, TypeScript, and MongoDB**, with authentication handled by **Clerk** and payment tracking via **Stripe**. The system is designed to optimize business operations and streamline restaurant management tasks.

## Installation

### 1. Install Dependencies
```bash
cd restaurant-admin
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root of the project and add the following:

```env
NEXT_PUBLIC_CLOUDINARY_URL=your-cloudinary-url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
CLERK_FRONTEND_API=your-clerk-frontend-api
CLERK_API_KEY=your-clerk-api-key
MONGODB_URI=your-mongodb-uri
```

### 3. Run the Development Server
```bash
npm run dev
```
Your app will be running at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the project for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to check for code quality issues.

## Dependencies

This project uses the following dependencies:

- `@clerk/nextjs` - Clerk authentication.
- `@hookform/resolvers` - Form validation.
- `@radix-ui/react-alert-dialog`, `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-separator`, `@radix-ui/react-slot` - UI components.
- `@tanstack/react-table` - Table management.
- `class-variance-authority` - Utility for class names.
- `clsx` - Utility for constructing className strings conditionally.
- `cmdk` - Command menu component.
- `date-fns` - Date utilities.
- `jspdf` - PDF generation.
- `lucide-react` - Icons for React.
- `mongoose` - MongoDB data management.
- `next`, `react`, `react-dom` - Core libraries.
- `react-hook-form` - Form management.
- `react-hot-toast` - Toast notifications.
- `recharts` - Charting library.
- `stripe` - Stripe API library for payments.
- `tailwind-merge` - Tailwind class merging.
- `tailwindcss-animate` - Animation utilities for Tailwind CSS.
- `zod` - Schema validation.

## Development

- TypeScript is used for type safety. Configure options in `tsconfig.json`.
- ESLint is used for linting, following `eslint-config-next`.

## Contributing

If you want to contribute to the project:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -am 'Add feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for providing an excellent framework.
- [Stripe](https://stripe.com/) for making payment processing simple and secure.
- [Clerk](https://clerk.dev/) for user authentication and management.
- [Cloudinary](https://cloudinary.com/) for efficient image management.
- [MongoDB](https://www.mongodb.com/) for powerful NoSQL database solutions.
- [Tailwind CSS](https://tailwindcss.com/) for creating modern, responsive designs with ease.

---

This project was developed as part of a **thesis project** to demonstrate the development of an integrated restaurant management system using modern web technologies.

