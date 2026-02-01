import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AssessScreen from "@/screens/AssessScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type AssessStackParamList = {
  Assess: undefined;
};

const Stack = createNativeStackNavigator<AssessStackParamList>();

export default function AssessStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Assess"
        component={AssessScreen}
        options={{
          headerTitle: "New Assessment",
        }}
      />
    </Stack.Navigator>
  );
}
