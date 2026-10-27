import { DemoApp } from "@/components/DemoApp";
import { LangProvider } from "@/components/LangProvider";

export default function Page() {
  return (
    <LangProvider>
      <DemoApp />
    </LangProvider>
  );
}
