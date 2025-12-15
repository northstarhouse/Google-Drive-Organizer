import { Photo } from "../types";

// This simulates the Google Drive Picker API interaction
export const importFromGoogleDrive = async (): Promise<Photo[]> => {
  // Simulate network latency for authentic feel
  await new Promise(resolve => setTimeout(resolve, 1500));

  // We will generate a set of photos that includes:
  // 1. Unique photos
  // 2. Exact duplicates (same photo content/date/size, different ID)
  // 3. Name conflicts (copy of...)
  
  const baseDate = new Date();
  
  const drivePhotos: Array<Partial<Photo>> = [
    {
      name: "Vacation_Mountain.jpg",
      url: "https://picsum.photos/id/10/800/800", // Forest
      size: 240500,
      date: new Date("2023-06-15T10:30:00"),
    },
    {
      name: "Copy of Vacation_Mountain.jpg", // DUPLICATE of above
      url: "https://picsum.photos/id/10/800/800",
      size: 240500,
      date: new Date("2023-06-15T10:30:00"),
    },
    {
      name: "Family_Picnic.jpg",
      url: "https://picsum.photos/id/28/800/800", // Forest/People
      size: 180200,
      date: new Date("2023-07-20T14:15:00"),
    },
    {
      name: "Family_Picnic (1).jpg", // DUPLICATE of above
      url: "https://picsum.photos/id/28/800/800",
      size: 180200,
      date: new Date("2023-07-20T14:15:00"),
    },
    {
      name: "Office_Setup.jpg",
      url: "https://picsum.photos/id/1/800/800", // Laptop
      size: 305000,
      date: new Date("2024-01-10T09:00:00"),
    },
    {
      name: "Project_Blueprints.jpg", // Unique
      url: "https://picsum.photos/id/60/800/800", // Desk
      size: 410000,
      date: new Date("2024-02-05T16:45:00"),
    },
    {
      name: "Coffee_Break.jpg", // Unique
      url: "https://picsum.photos/id/42/800/800", // Coffee
      size: 150000,
      date: new Date("2024-02-05T10:00:00"),
    }
  ];

  return drivePhotos.map(p => ({
    id: crypto.randomUUID(),
    file: undefined, // Drive files don't have a File object initially
    url: p.url!,
    name: p.name!,
    date: p.date!,
    size: p.size!,
    source: 'drive',
    status: 'pending'
  }));
};
