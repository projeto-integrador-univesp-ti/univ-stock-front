import "@radix-ui/colors";
import { ArchiveIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import { Menubar } from "radix-ui";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { Path } from "../../router";
import styles from "./styles.module.css";

const TopBarSite: React.FC = () => {
  const navigate = useNavigate();
  const redirectLogin = () => navigate(Path.Login);
  const redirectDashboard = () => navigate(Path.Dashboard);
  const redirectSettings = () => navigate(Path.Settings);
  const redirectPointOfSale = () => navigate(Path.PointOfSale);
  const redirectProductManagement = () => navigate(Path.ProductManagement);

  const { appearance } = useGlobalContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f2") {
        e.preventDefault();
        redirectPointOfSale();
      }
      if (e.key.toLowerCase() === "f3") {
        e.preventDefault();
        redirectProductManagement();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      p="4"
      height="60px"
      align="center"
      justify="between"
      style={{
        boxSizing: "border-box",
        boxShadow: `var(--shadow-${appearance === "dark" ? 2 : 1})`,
      }}
    >
      <Flex gap="3" mr="5" align="center" justify="center">
        <ArchiveIcon
          width="20"
          height="20"
          color={appearance === "dark" ? "white" : "black"}
        />
        <Text weight="bold" size="4">
          Mini Stock
        </Text>
      </Flex>

      <Menubar.Root className={styles.Root}>
        {/* <Button
          size="3"
          variant="ghost"
          className={
            location.pathname === Path.Dashboard ? styles.Invisible : undefined
          }
          style={{
            padding: "var(--space-2) var(--space-1)",
            marginRight: "var(--space-1)",
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon width="15" height="15" />
        </Button> */}
        <Menubar.Menu>
          <Menubar.Trigger
            className={styles.Trigger}
            onClick={redirectDashboard}
          >
            Dashboard
          </Menubar.Trigger>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger className={styles.Trigger}>Venda</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              className={styles.Content}
              align="start"
              sideOffset={5}
              alignOffset={0}
            >
              <Menubar.Item
                className={styles.Item}
                onClick={redirectPointOfSale}
              >
                Ponto de Vendas (PDV) <div className={styles.RightSlot}>F2</div>
              </Menubar.Item>
              <Menubar.Separator className={styles.Separator} />
              <Menubar.Sub>
                <Menubar.SubTrigger className={styles.SubTrigger}>
                  Relatórios
                  <div className={styles.RightSlot}>
                    <ChevronRightIcon />
                  </div>
                </Menubar.SubTrigger>

                <Menubar.Portal>
                  <Menubar.SubContent
                    className={styles.SubContent}
                    alignOffset={-5}
                  >
                    <Menubar.Item className={styles.Item} disabled>
                      Venda por período
                    </Menubar.Item>
                    <Menubar.Item className={styles.Item} disabled>
                      Venda por produto
                    </Menubar.Item>
                  </Menubar.SubContent>
                </Menubar.Portal>
              </Menubar.Sub>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger className={styles.Trigger}>Estoque</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              className={styles.Content}
              align="start"
              sideOffset={5}
              alignOffset={0}
            >
              <Menubar.Item className={`${styles.Item} inset`} onClick={redirectProductManagement}>
                Gestão de produtos <div className={styles.RightSlot}>F3</div>
              </Menubar.Item>
              <Menubar.Item className={`${styles.Item} inset`} disabled>
                Gestão de fornecedores{" "}
                <div className={styles.RightSlot}>F4</div>
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger
            className={styles.Trigger}
            data-only-children="true"
            onClick={redirectSettings}
          >
            Configurações
          </Menubar.Trigger>
        </Menubar.Menu>
      </Menubar.Root>

      <Flex justify="end" style={{ flex: 1 }}>
        <Button size="2" variant="ghost" onClick={redirectLogin}>
          Sair
          <ExitIcon width="15" height="15" />
        </Button>
      </Flex>
    </Flex>
  );
};

export { TopBarSite };
