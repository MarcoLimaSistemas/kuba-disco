import React, { useEffect, useState } from 'react';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

import { StateChangeEvent } from 'react-native-bluetooth-classic/lib/BluetoothEvent';
import ConnectionScreen from './src/screens/ConnectionScreen';
import DeviceListScreen from './src/screens/DeviceListScreen';


interface AppState {
  device?: BluetoothDevice;
  bluetoothEnabled: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    device: undefined,
    bluetoothEnabled: true,
  });

  let enabledSubscription: any;
  let disabledSubscription: any;

  const selectDevice = (device: BluetoothDevice) => {
    console.log('App::selectDevice() called with: ', device);
    setState((prevState) => ({ ...prevState, device }));
  };

  const checkBluetoothEnabled = async () => {
    try {
      console.log('App::componentDidMount Checking bluetooth status');
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      console.log(`App::componentDidMount Status: ${enabled}`);
      setState((prevState) => ({ ...prevState, bluetoothEnabled: enabled }));
    } catch (error) {
      console.log('App::componentDidMount Status Error: ', error);
      setState((prevState) => ({ ...prevState, bluetoothEnabled: false }));
    }
  };

  const onStateChanged = (stateChangedEvent: StateChangeEvent) => {
    console.log('App::onStateChanged event used for onBluetoothEnabled and onBluetoothDisabled');

    setState((prevState) => ({
      ...prevState,
      bluetoothEnabled: stateChangedEvent.enabled,
      device: stateChangedEvent.enabled ? prevState.device : undefined,
    }));
  };

  useEffect(() => {
    console.log('App::componentDidMount adding listeners: onBluetoothEnabled and onBluetoothDistabled');
    console.log('App::componentDidMount alternatively could use onStateChanged');
    enabledSubscription = RNBluetoothClassic.onBluetoothEnabled(onStateChanged);
    disabledSubscription = RNBluetoothClassic.onBluetoothDisabled(onStateChanged);

    checkBluetoothEnabled();

    return () => {
      console.log('App:componentWillUnmount removing subscriptions: enabled and disabled');
      console.log('App:componentWillUnmount alternatively could have used stateChanged');
      enabledSubscription.remove();
      disabledSubscription.remove();
    };
  }, []);

  return (
    <>
      {!state.device ? (
        <DeviceListScreen
          bluetoothEnabled={state.bluetoothEnabled}
          selectDevice={selectDevice}
        />
      ) : (
        <ConnectionScreen
          device={state.device}
          onBack={() => setState((prevState) => ({ ...prevState, device: undefined }))}
        />
      )}
    </>
  );
};

export default App;
