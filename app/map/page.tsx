import { title } from "@/components/primitives";
import {BasicMap} from "@/app/map/components/BasicMap";

export default function AboutPage() {
  return (
      <section className="flex flex-col items-center justify-center gap-4">
          <h1 className={title()}>Deutschlandkarte</h1>
          <BasicMap width={1000} height={700}/>
      </section>
  );
}
