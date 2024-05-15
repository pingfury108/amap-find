import { Storage } from "@plasmohq/storage";

export const storage = new Storage({
  area: "local",
});
export const storage_key = "place-data";

export interface PlaceData {
  id: String
  name: String
  addr: String
  phone: String
}

export async function set_place(data: PlaceData) {
  if (data === null) {
    return
  }
  var place_ss = await storage.get(storage_key);
  console.log("set place all data", place_ss);
  var place = [].concat(place_ss);
  place.push(data);
  place = place.filter(Boolean);
  place = place.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.name === item.name
    ))
  );
  place = place.filter(p => p.phone !== '');
  await storage.set(storage_key, place);
}

export async function get_all_data(): Promise<Array<PlaceData>> {
  var place_ss = await storage.get(storage_key);
  if (place_ss) {
    var place: Array<PlaceData> = [].concat(place_ss).filter(p => p !== null);
  } else {
    var place: Array<PlaceData> = [];
  }
  console.log("all data: ", place)
  return place
}
