function App() {

    const [deviceId, setDeviceId] = useState({});
    const [devices, setDevices] = useState([]);
    const [indexCam, setIndexCam] = useState(0);

    const handleDevices = useCallback(
      mediaDevices =>
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
      [setDevices]
    );

    useEffect(
      () => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },
      [handleDevices]
    );

    return (
      <>
        <div>
            <Webcam audio={false} videoConstraints={devices[indexCam]} />
            <button style={{position: 'absolute', bottom: 50}} onClick={() => setIndexCam((index) => (index+1)%devices.length)}>Switch Camera</button>
          </div>
      </>
    );
  }