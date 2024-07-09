import { Grid, Typography } from "@material-ui/core";
import video from './video.mp4';

const Welcome = (props) => {
  return (
    <Grid container item direction="column" alignItems="center" justify="center">
    </Grid>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
