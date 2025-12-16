import { ConvexClientProvider } from "@/lib/convex-provider";

function Layout({ children }: LayoutProps<"/">) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
export default Layout;
