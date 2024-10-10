import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';

const IntroTour = () => {
  const [runTour, setRunTour] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/home';

  useEffect(() => {
    if (isMainPage) {
      const tourRun = localStorage.getItem('tourRun');
      if (!tourRun) {
        setRunTour(true);
        localStorage.setItem('tourRun', 'true');
      }
    }
  }, [isMainPage]);

  const steps = [
    {
      target: 'body',
      content: 'Welcome to our website! Let\'s take a quick tour.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.dashboard-link',
      content: 'Click here to access your dashboard.',
      placement: 'bottom',
      beforeNext: () => {
        navigate('/dashboard');
      },
    },
    {
      target: '.complain-link',
      content: 'You can file a complaint here.',
      placement: 'bottom',
      beforeNext: () => {
        navigate('/complain');
      },
    },
    {
      target: '.community-link',
      content: 'Join our community discussions here.',
      placement: 'bottom',
      beforeNext: () => {
        navigate('/community');
      },
    },
    {
      target: '.routed-link',
      content: 'View safe routes to reach your destination here',
      placement: 'bottom',
      beforeNext: () => {
        navigate('/incidents');
      },
    },
    {
      target: '.data-link',
      content: 'View FIR data of maharashtra here.',
      placement: 'bottom',
      beforeNext: () => {
        navigate('/incidents');
      },
    },
    {
      target: '.track-link',
      content: 'You can track a complaint here.',
      placement: 'bottom',
      beforeNext: () => {
        navigate('/incidents');
      },
    },
    {
      target: 'body',
      content: 'That concludes our tour. Feel free to explore more on your own!',
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status, index } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      navigate('/home'); // Return to home page when tour ends
    } else if (status === STATUS.READY) {
      // If the tour is starting, make sure we're on the home page
      navigate('/home');
    }
  };

  return (
    <>
      {isMainPage && (
        <button 
          onClick={() => setRunTour(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Start Tour
        </button>
      )}
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        styles={{
          options: {
            primaryColor: '#007bff',
          },
        }}
        callback={handleJoyrideCallback}
      />
    </>
  );
};

export default IntroTour;