import { Stack } from "expo-router";
import './globals.css';
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
      <>
         {/*<StatusBar hidden={true} />*/}
        <Stack>
          <Stack.Screen
              name="(tabs)"
              options={{headerShown: false}} // Hides the header for the group tabs layout
          />

          <Stack.Screen
              name="recipes/[id]"
              options={{headerShown: false}}
          />
        </Stack>
      </>
  );
}
