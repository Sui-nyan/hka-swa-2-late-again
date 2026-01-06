import { title } from "@/components/primitives";
import {BasicMap} from "@/app/map/components/BasicMap";

export default function AboutPage() {
  return (
      <section>
        <h1 className={title()}>Overview Germany</h1>
          <div>
              <BasicMap></BasicMap>
          </div>
      </section>
  );
}
