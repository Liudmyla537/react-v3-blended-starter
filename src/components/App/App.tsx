import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import toast, {Toaster} from "react-hot-toast"
import { useState } from "react";
import { getPhotos } from "../../services/photos";
import type { Photo } from "../../types/photo";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Text from "../Text/Text";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

export default function App() {
 
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
 

  const handleSearch  = async (query: string) => {
    setIsEmpty(false);
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getPhotos(query);
    if (!data.length) {
      toast.error(`We don't find photos with ${query}`);
      setIsEmpty(true);
      return;
    }
    setPhotos(data);
    } catch (error) {
      setIsError(true);
      console.log("Fetch error:", error);
    }
    finally {
      setIsLoading(false);
    }
    
  };
  
  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => setSelectedPhoto(null)

  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSearch } />
          {photos.length > 0 && <PhotosGallery photos={photos} onSelect={handleSelectPhoto} />}
          {isEmpty && <Text textAlign="center">"We don't find photos</Text>}
          {isLoading && <Loader />}
          {isError && <Text>Something went wrong...</Text>}
          {selectedPhoto && (
            <Modal photo={selectedPhoto} onClose={closeModal}/> 
          )}
        </Container>
      </Section>
      
      <Toaster />
      
    </>
  );
}
