"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data } = useSession();

  const handleLoginClick = async () => {
    await signIn("google");
  };

  return (
    <Card>
      <CardContent className="p-5 justify-between flex items-center">
        <Image src="/logo.png" alt="FSW Barber" height={18} width={130} />
        <Button variant="outline" size="icon" className="h-8 w-8">
          <MenuIcon size={18} />
        </Button>
        
      </CardContent>
    </Card>
  );
};

export default Header;
