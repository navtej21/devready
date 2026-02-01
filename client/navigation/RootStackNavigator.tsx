import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import ResultsScreen from "@/screens/ResultsScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import type { Assessment } from "@/lib/storage";

export type RootStackParamList = {
  Main: undefined;
  Results: { assessment: Assessment };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          presentation: "modal",
          headerTitle: "Your Readiness Score",
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerTitle: "Assessment History",
        }}
      />
    </Stack.Navigator>
  );
}
