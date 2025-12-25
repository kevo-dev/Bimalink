
"use client";

import { Navbar } from "@/components/Navbar";
import { useComparison } from "@/context/ComparisonContext";

export default function NavbarWrapper() {
  const { selectedProducts } = useComparison();
  return <Navbar comparisonCount={selectedProducts.length} />;
}
