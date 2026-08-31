/**
 * 
 * A class that handles our Pages
 * 
 */
export default function PageContainer({
  children,
  className = "",
}) {
  return (
    <main className={`bap-page ${className}`}>
      {children}
    </main>
  );
}