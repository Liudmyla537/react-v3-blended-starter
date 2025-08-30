import Grid from "../Grid/Grid";
import { Photo } from "../../types/photo";
import GridItem from "../GridItem/GridItem";
import PhotosGalleryItem from "../PhotosGalleryItem/PhotosGalleryItem";

interface PhotosGalleryProps{
  photos: Photo[];
  onSelect: (photo: Photo) => void;
}

export default function PhotosGallery({ photos, onSelect }: PhotosGalleryProps) {
 
  return (
    <Grid>
      {photos.map((photo) => {
        return (
          <GridItem key={photo.id}>
            <PhotosGalleryItem photo={photo} onClick={ () => onSelect(photo)} />
          </GridItem>
        );
      })}
    </Grid>
    );
}
