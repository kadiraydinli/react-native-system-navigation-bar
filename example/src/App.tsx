import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import SystemNavigationBar, {
  GetBarColorType,
} from 'react-native-system-navigation-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Hide"
        onPress={async () => {
          const result = await SystemNavigationBar.navigationHide();

          console.log('Hide: ', result);
        }}
      />

      <Button
        title="Show"
        onPress={async () => {
          const result = await SystemNavigationBar.navigationShow();

          console.log('Show: ', result);
        }}
      />

      <Button
        title="leanBack"
        onPress={async () => {
          const result = await SystemNavigationBar.leanBack();

          console.log('leanBack: ', result);
        }}
      />

      <Button
        title="immersive"
        onPress={async () => {
          const result = await SystemNavigationBar.immersive();

          console.log('immersive: ', result);
        }}
      />

      <Button
        title="stickyImmersive"
        onPress={async () => {
          const result = await SystemNavigationBar.stickyImmersive();

          console.log('stickyImmersive: ', result);
        }}
      />

      <Button
        title="setBarMode"
        onPress={async () => {
          const result = await SystemNavigationBar.setBarMode('dark');

          console.log('setBarMode: ', result);
        }}
      />

      <Button
        title="fullScreen"
        onPress={async () => {
          const result = await SystemNavigationBar.fullScreen();

          console.log('fullScreen: ', result);
        }}
      />

      <Button
        title="lowProfile"
        onPress={async () => {
          const result = await SystemNavigationBar.lowProfile();

          console.log('lowProfile: ', result);
        }}
      />

      <Button
        title="Color"
        onPress={async () => {
          const result = await SystemNavigationBar.setNavigationColor('red');

          console.log('Color: ', result);
        }}
      />

      <Button
        title="Divider Color"
        onPress={async () => {
          const result = await SystemNavigationBar.setNavigationBarDividerColor(
            'red'
          );

          console.log('Divider Color: ', result);
        }}
      />

      <Button
        title="Contrast Enforced"
        onPress={async () => {
          const result =
            await SystemNavigationBar.setNavigationBarContrastEnforced(true);

          console.log('Contrast Enforced: ', result);
        }}
      />

      <Button
        title="Get Bar Color"
        onPress={async () => {
          const result: GetBarColorType = await SystemNavigationBar.getBarColor(
            'both'
          );
          console.log('Get Bar Color: ', JSON.stringify(result));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFFF',
  },
});
