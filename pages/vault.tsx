import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';


const Vault: NextPage = ({ photos }) => {
  const [selected, setSelected] = useState(undefined);

  const selectedPhoto = selected !== undefined ? photos.find(({id}) => id === selected) : undefined;

  return (
    <>
      <Head>
        <title>Vault</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Grid
        container
        spacing={2}
        style={{ padding: 10 }}
      >
        {
          photos.map(photo => <Grid key={photo.id} item>
            <img src={photo.thumbnailUrl} alt={photo.title} onClick={() => setSelected(photo.id)}/>
          </Grid>)
        }
      </Grid>
      <Dialog open={selected !== undefined} onClose={() => setSelected(undefined)}>
        <img src={selectedPhoto?.url} alt={selectedPhoto?.title} />
      </Dialog>
    </>
  );
};

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://jsonplaceholder.typicode.com/photos`);
  const photos = await res.json();

  // Pass data to the page via props
  return { props: { photos } }
}

export default Vault;
