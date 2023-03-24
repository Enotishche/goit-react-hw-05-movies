import { useLocation, useParams, Outlet } from 'react-router-dom';
import { useState, useEffect, Suspense } from 'react';
import { getMovieId } from '../../api/FetchAPI';
import { Loader } from '../../components/Loader/Loader';
import MovieInfo from '../../components/MovieInfo/MovieInfo';
import {
  BackLink,
  MovieSubtitle,
  AdditionalLink,
  AdditionalBox,
} from './MovieDetails.styled';

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const location = useLocation();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backLinkHref = location.state?.from ?? '/movies';

  useEffect(() => {
    async function fetchInfo() {
      setIsLoading(true);
      try {
        const data = await getMovieId(movieId);

        setMovie(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInfo();
  }, [movieId]);

  return (
    <main className="container">
      <BackLink to={backLinkHref}>&larr; Back to</BackLink>
      {isLoading && <Loader />}
      {error && <p>Oops...Something went wrong</p>}
      {movie && <MovieInfo movie={movie} />}
      <AdditionalBox>
        <MovieSubtitle>Additional information</MovieSubtitle>
        <AdditionalLink to="cast" state={{ from: backLinkHref }}>
          Cast
        </AdditionalLink>
        <AdditionalLink to="reviews" state={{ from: backLinkHref }}>
          Reviews
        </AdditionalLink>
      </AdditionalBox>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </main>
  );
}
