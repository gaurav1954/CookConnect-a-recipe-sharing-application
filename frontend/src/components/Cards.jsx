import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import './Cards.css';

export default function Cards({ recipeId, title = 'burger', image = 'https://images.unsplash.com/photo-1501959915551-4e8d30928317?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/100px180', likes, cookingTime = 30, ingredients = [1, 2, 3] }) {
  const [liked, setLiked] = useState(0);
  const [likeCount, setLikeCount] = useState(likes); // Initialize like count to 0 initially

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const apiUrl = `http://localhost:8000/recipes/${recipeId}/like-status`; // API endpoint to get like status
        const response = await fetch(apiUrl, {
          method: 'GET',
          credentials: 'include' // Include credentials in the request
        });
        const data = await response.json();
        setLiked(data.liked); // Initialize liked state based on the response from the API
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };
    fetchLikeStatus();
  }, [recipeId]);
  // Execute effect when recipeId changes
  const handleLikeClick = async () => {
    try {
      const apiUrl = 'http://localhost:8000/recipes'; // API base URL

      if (liked == true) {
        // Unlike the recipe
        await fetch(`${apiUrl}/unlike/${recipeId}`, {
          method: 'POST',
          credentials: 'include', // Include credentials in the request
        });

        setLikeCount(prevCount => prevCount - 1); // Decrease like count
      }
      if (liked == false) {
        // Like the recipe
        await fetch(`${apiUrl}/like/${recipeId}`, {
          method: 'POST',
          credentials: 'include', // Include credentials in the request
        });
        setLikeCount(prevCount => prevCount + 1); // Increase like count
      }
      setLiked(old => !old); // Toggle liked state
    }
    catch (error) {
      console.error('Error:', error);

    }
  };

  return (
    <Card className="custom-card">
      <div className="image-container">
        <Button variant="light-danger" className="like-button" onClick={handleLikeClick}>
          <FontAwesomeIcon icon={faThumbsUp} className={`${liked ? 'orange-btn' : ''}`} />
          <b>{likeCount}</b>
        </Button>
        <Button variant="light-solid" className="bookmark-button">
          <FontAwesomeIcon icon={faBookmark} /> <b>33</b>
        </Button>
        <Card.Img
          src={image}
          alt="Card image"
        />
        <div className="menu-icon">
          <FontAwesomeIcon icon={faEllipsisV} />
        </div>
      </div>
      <Card.Body >
        <Card.Title className="title">{title}</Card.Title>
        <div className="card-text">
          <div className="ingredients">{ingredients.length} ingredients</div>
          <div className="re-time">{cookingTime} mins</div>
        </div>
      </Card.Body>
    </Card>
  );
}
